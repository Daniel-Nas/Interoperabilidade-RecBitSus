const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// 📁 Caminho do banco
const filePath = path.join(__dirname, "bundles.json");

// 🔒 Garante que o arquivo existe
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]");
}

app.use(cors());
app.use(express.json());

// ================= BANCO =================

function lerBanco() {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

function salvarBanco(data: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ================= FHIR =================

function generateFHIRBundle(data: any) {
  const patientId = "patient-" + Date.now();
  const observationId = "obs-" + Date.now();
  const bundleId = "bundle-" + Date.now();

  return {
    id: bundleId,
    resourceType: "Bundle",
    type: "collection",
    timestamp: new Date().toISOString(),

    entry: [
      {
        resource: {
          resourceType: "Patient",
          id: patientId,
          active: data.active === "true" || data.active === true,

          identifier: [
            {
              system: "CPF",
              value: data.cpf
            }
          ],

          name: [{ text: data.nome }],

          telecom: [
            { system: "phone", value: data.telefone },
            { system: "email", value: data.email }
          ],

          gender: data.gender,
          birthDate: data.birthDate,

          address: [{ text: data.address }],

          contact: [
            {
              name: {
                text: data.contatoEmergencia
              }
            }
          ]
        }
      },

      {
        resource: {
          resourceType: "Observation",
          id: observationId,
          status: data.status,

          category: [{ text: data.category }],

          code: { text: data.code },

          subject: {
            reference: `Patient/${patientId}`
          },

          effectiveDateTime: data.effectiveDateTime,

          valueQuantity: {
            value: Number(data.value),
            unit: data.unit
          }
        }
      }
    ]
  };
}

// ================= ROTAS =================

app.get("/", (req: any, res: any) => {
  res.send("Servidor FHIR rodando 🚀");
});

// ➕ Criar bundle
app.post("/bundle", (req: any, res: any) => {
  const bundle = generateFHIRBundle(req.body);

  const banco = lerBanco();
  banco.push(bundle);
  salvarBanco(banco);

  res.json(bundle);
});

// 🔍 Buscar por CPF
app.get("/bundle/cpf/:cpf", (req: any, res: any) => {
  const banco = lerBanco();

  const resultados = banco.filter((b: any) => {
    const cpfBanco =
      b?.entry?.[0]?.resource?.identifier?.[0]?.value;

    return String(cpfBanco).trim() == String(req.params.cpf).trim();
  });

  if (resultados.length === 0) {
    return res.status(404).json({
      error: "Nenhum bundle encontrado"
    });
  }

  res.json(resultados);
});

// 📚 Listar todos
app.get("/bundles", (req: any, res: any) => {
  res.json(lerBanco());
});

// 🗑️ Deletar
app.delete("/bundle/:id", (req: any, res: any) => {
  let banco = lerBanco();

  banco = banco.filter((b: any) => b.id !== req.params.id);

  salvarBanco(banco);

  res.json({ message: "Removido" });
});

// ================= START =================

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});