import express from "express";
import crypto from "crypto";
import { spawn } from "child_process";
import "dotenv/config";

const app = express();

// IMPORTANT : pour vérifier les signatures GitHub, vous devez utiliser
// les *octets bruts* du corps de la requête.
app.post("/webhook/github", express.raw({ type: "*/*" }), async (req, res) => {
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) return res.status(500).send("GITHUB_WEBHOOK_SECRET manquant");

    // GitHub envoie la signature dans X-Hub-Signature-256 lorsqu'un secret est configuré.
    const sigHeader = req.header("X-Hub-Signature-256");
    if (!sigHeader) return res.status(401).send("En-tête de signature manquant");

    const expected =
      "sha256=" +
      crypto.createHmac("sha256", secret).update(req.body).digest("hex");

    const ok = crypto.timingSafeEqual(
      Buffer.from(sigHeader),
      Buffer.from(expected)
    );

    if (!ok) return res.status(401).send("Signature invalide");

    // Parser le payload JSON après vérification de la signature
    const payload = JSON.parse(req.body.toString("utf8"));

    // Agir uniquement sur les événements push
    const event = req.header("X-GitHub-Event");
    if (event !== "push") return res.status(200).send("Événement ignoré");

    const targetBranch = process.env.TARGET_BRANCH || "main";
    const ref = payload?.ref; // ex. "refs/heads/main"

    if (ref !== `refs/heads/${targetBranch}`) {
      return res.status(200).send(`Branche ignorée ${ref}`);
    }

    console.log(`\n🚀 Push détecté sur ${targetBranch} - Démarrage du déploiement...`);

    // Déclencher le script de déploiement
    const script = process.platform === "win32" ? "deploy.ps1" : "deploy.sh";
    const cmd = process.platform === "win32" ? "powershell.exe" : "bash";
    const args =
      process.platform === "win32"
        ? ["-ExecutionPolicy", "Bypass", "-File", script]
        : [script];

    const child = spawn(cmd, args, {
      env: process.env,
      stdio: "inherit",
      cwd: import.meta.dirname,
    });

    child.on("exit", (code) => {
      if (code === 0) console.log("✅ Déploiement terminé avec succès");
      else console.error("❌ Échec du déploiement, code", code);
    });

    res.status(200).send("Déploiement déclenché");
  } catch (e) {
    console.error(e);
    res.status(500).send("Erreur serveur");
  }
});

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("🔗 Webhook listener actif! Endpoint: POST /webhook/github");
});

const port = Number(process.env.WEBHOOK_PORT || 9000);
app.listen(port, () => {
  console.log(`\n========================================`);
  console.log(`🎯 Webhook listener démarré!`);
  console.log(`📍 URL locale: http://localhost:${port}/webhook/github`);
  console.log(`========================================\n`);
});
