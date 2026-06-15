import React, { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState<any>({});
  const [bundle, setBundle] = useState<any>(null);
  const [buscaId, setBuscaId] = useState("");

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 GERAR BUNDLE
const gerarBundle = async () => {
  try {
    console.log("Enviando:", form);

    const res = await axios.post(
      "http://localhost:3001/bundle",
      form
    );

    console.log("RESPOSTA COMPLETA:", res);
    console.log("RESPOSTA DATA:", res.data);

    setBundle(res.data);

    console.log("STATE ATUALIZADO");
  } catch (err) {
    console.error("Erro ao gerar bundle:", err);
  }
};

  // 🔍 BUSCAR BUNDLE
  const buscarBundle = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/bundle/cpf/${buscaId}`
      );

      setBundle(res.data);
    } catch (err) {
      console.error("Erro ao buscar bundle:", err);
      alert("Bundle não encontrado!");
    }
  };

  return (
    <div className="container">
      <h1>Atividade prática - AULA 7</h1>

      {/* PACIENTE */}
      <div className="card">
        <h2>Pacient</h2>

        <div className="grid">
          <input name="nome" placeholder="Nome" onChange={handleChange} />
          <input name="cpf" placeholder="CPF" onChange={handleChange} />
          <input name="telefone" placeholder="Telefone" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="gender" placeholder="Gênero" onChange={handleChange} />
          <input name="birthDate" type="date" onChange={handleChange} />
          <input name="address" placeholder="Endereço" onChange={handleChange} />
          <input name="contatoEmergencia" placeholder="Contato emergência" onChange={handleChange} />
          <input name="active" placeholder="Ativo (true/false)" onChange={handleChange} />
        </div>
      </div>

      {/* OBSERVAÇÃO */}
      <div className="card">
        <h2>Observation</h2>

        <div className="grid">
          <input name="status" placeholder="Status" onChange={handleChange} />
          <input name="category" placeholder="Categoria" onChange={handleChange} />
          <input name="code" placeholder="Ex: glicose" onChange={handleChange} />
          <input name="effectiveDateTime" type="datetime-local" onChange={handleChange} />
          <input name="value" placeholder="Valor" onChange={handleChange} />
          <input name="unit" placeholder="Unidade" onChange={handleChange} />
        </div>
      </div>

      <button className="btn" onClick={gerarBundle}>
        Gerar Bundle
      </button>

      {/* BUSCA */}
      <div className="card">
        <h2>Buscar por CPF</h2>

        <div className="search">
          <input
            placeholder="Digite o CPF"
            onChange={(e) => setBuscaId(e.target.value)}
          />
          <button onClick={buscarBundle}>Buscar</button>
        </div>
      </div>

      {/* RESULTADO */}
      {bundle !== null && (
        <div className="card">
          <h2>Resultado</h2>

          <pre className="json">
            {JSON.stringify(bundle, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;