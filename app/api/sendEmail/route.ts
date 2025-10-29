
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/sendEmail/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Função auxiliar para converter uma string base64 (com prefixo) em attachment
const base64ToAttachment = (doc: { title: string; url: string }) => {
  if (!doc?.url) {
    return null;
  }
  const parts = doc.url.split(",");
  if (parts.length !== 2) {
    return null;
  }
  const mimeMatch = parts[0].match(/^data:(.+);base64$/);
  let extension = "bin";
  let contentType: string | undefined;
  if (mimeMatch && mimeMatch[1]) {
    const mimeType = mimeMatch[1];
    contentType = mimeType;
    const mimeParts = mimeType.split("/");
    if (mimeParts.length === 2 && mimeParts[1]) {
      extension = mimeParts[1];
    }
  }
  return {
    filename: `${doc.title}.${extension}`,
    content: parts[1],
    encoding: "base64" as const,
    contentType,
  };
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const dataField = formData.get("data");
    let parsedData: any = {};
    if (typeof dataField === "string") {
      parsedData = JSON.parse(dataField);
    }

    // Converte documentos para attachments (se houver)
    const attachments = Array.isArray(parsedData.documentos)
      ? parsedData.documentos
          .map((doc: any) => base64ToAttachment(doc))
          .filter(
            (
              item: any
            ): item is {
              filename: string;
              content: string;
              encoding: "base64";
              contentType?: string;
            } => Boolean(item)
          )
      : [];

    // Nome do primeiro beneficiário para exibição no cabeçalho
    const cliente =
      parsedData.beneficiarios &&
      Array.isArray(parsedData.beneficiarios) &&
      parsedData.beneficiarios.length > 0
        ? parsedData.beneficiarios[0].nome
        : "N/A";

    // Funções auxiliares para renderizar itens em container flex com separador

    const renderFlexItems = (items: any[], renderItem: (item: any) => string) => {
      if (!items || !items.length) return "<p>N/A</p>";
      // Mapeia cada item e insere uma barra vertical separadora entre eles
      return `<div style="display: flex; align-items: flex-start;">` +
        items
          .map((item, index) => {
            return `
              <div style="flex: 1; padding: 10px;">
                ${renderItem(item)}
              </div>
              ${index < items.length - 1 ? `<div style="margin: 0 10px; font-weight: bold;">|</div>` : ""}
            `;
          })
          .join("") +
        `</div>`;
    };

    const renderNomeEmpresa = (nome: string) => `<p>${nome}</p>`;

    const renderDiretor = (dir: any) => `
      <strong>${dir.nome}</strong>
      <ul style="list-style: disc; margin-left: 15px; padding-left: 0;">
        <li><strong>Origem:</strong> ${dir.origem || "N/A"}</li>
        <li><strong>Nascimento:</strong> ${dir.nascimento || "N/A"}</li>
        <li><strong>Endereço:</strong> ${dir.address || "N/A"}</li>
        <li><strong>Telefone:</strong> ${dir.telefone || "N/A"}</li>
        <li><strong>Email:</strong> ${dir.email || "N/A"}</li>
        <li><strong>Occupation:</strong> ${dir.occupation || "N/A"}</li>
        <li><strong>Passport:</strong> ${dir.passport || "N/A"}</li>
      </ul>
    `;

    const renderAcionista = (a: any) => `
      <strong>${a.nomeEmpresa}</strong>
      <ul style="list-style: disc; margin-left: 15px; padding-left: 0;">
        <li><strong>País de Incorporação:</strong> ${a.paisIncorporacao || "N/A"}</li>
        <li><strong>Data de Incorporação:</strong> ${a.dataIncorporacao || "N/A"}</li>
        <li><strong>Percentual de Ações:</strong> ${a.percentualAcoes || "N/A"}</li>
      </ul>
    `;

    const renderBeneficiario = (b: any) => `
      <strong>${b.nome}</strong>
      <ul style="list-style: disc; margin-left: 15px; padding-left: 0;">
        <li><strong>Endereço:</strong> ${b.endereco || "N/A"}</li>
        <li><strong>Ocupação:</strong> ${b.ocupacao || "N/A"}</li>
        <li><strong>Nacionalidade:</strong> ${b.nacionalidade || "N/A"}</li>
        <li><strong>Data de Nascimento:</strong> ${b.dataNascimento || "N/A"}</li>
        <li><strong>É PEP:</strong> ${b.isPep ? "Sim" : "Não"}</li>
        <li><strong>Percentual Acionário:</strong> ${b.percentualAcionaria || "N/A"}</li>
      </ul>
    `;

    // Renderiza cada seção usando container flex
    const htmlNomeEmpresa =
      parsedData.nomeEmpresa && parsedData.nomeEmpresa.length
        ? renderFlexItems(parsedData.nomeEmpresa, renderNomeEmpresa)
        : "<p>N/A</p>";

    const htmlDiretores =
      parsedData.diretores && parsedData.diretores.length
        ? renderFlexItems(parsedData.diretores, renderDiretor)
        : "<p>N/A</p>";

    const htmlAcionistas =
      parsedData.acionistas && parsedData.acionistas.length
        ? renderFlexItems(parsedData.acionistas, renderAcionista)
        : "<p>N/A</p>";

    const htmlBeneficiarios =
      parsedData.beneficiarios && parsedData.beneficiarios.length
        ? renderFlexItems(parsedData.beneficiarios, renderBeneficiario)
        : "<p>N/A</p>";

    // Render Origem dos Fundos: lista simples + descrição
    const htmlOrigemFundos = (() => {
      let list = "";
      if (parsedData.origemFundos && parsedData.origemFundos.length) {
        list = parsedData.origemFundos
          .map((of: any) => `<li>${of}</li>`)
          .join("");
      } else {
        list = "<li>N/A</li>";
      }
      const descricao = parsedData.detalhesOrigemFundos
        ? `<p><strong>Detalhes:</strong> ${parsedData.detalhesOrigemFundos}</p>`
        : "";
      return `<ul>${list}</ul>${descricao}`;
    })();

    // Template HTML completo
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Formulário Enviado</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 1200px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
              }
              .header {
                  text-align: center;
                  background: #1E4E61;
                  padding: 20px;
                  color: #ffffff;
              }
              .header img {
                  max-width: 100px;
                  margin-bottom: 10px;
              }
              .header p {
                  font-size: 16px;
              }
              .content {
                  padding: 20px;
                  width: 100%;
              }
              .content h2, .content h3 {
                  margin-bottom: 10px;
              }
              .flex-container {
                  display: flex;
                  align-items: flex-start;
              }
              .flex-container > div {
                  flex: 1;
                  padding: 10px;
              }
              .separator {
                  margin: 0 10px;
                  font-weight: bold;
                  color: #888;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #aaa;
                  margin-top: 20px;
                  padding: 10px;
              }
              ul {
                  list-style: disc;
                  margin-left: 20px;
                  padding-left: 0;
              }
              li {
                  margin-bottom: 4px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://yourdomain.com/logo.png" alt="Logo" />
                  <p>Cliente: ${cliente}</p>
              </div>
              <div class="content">
                  <h2>Informações Gerais</h2>
                  <p><strong>Nome da Empresa:</strong> ${htmlNomeEmpresa}</p>
                  <p><strong>Tipo de Estrutura:</strong> ${parsedData.tipoEstrutura || "N/A"}</p>
                  <p><strong>Jurisdicao:</strong> ${parsedData.jurisdicao || "N/A"}</p>
                  <p><strong>Operacional:</strong> ${parsedData.isOperacional ? "Sim" : "Não"}</p>
                  <p><strong>Propósito de Incorporação:</strong> ${parsedData.propositoIncorporacao || "N/A"}</p>
                  
                  <h3>Diretores</h3>
                  ${htmlDiretores}
                  
                  <h3>Acionistas</h3>
                  ${htmlAcionistas}
                  
                  <h3>Beneficiários</h3>
                  ${htmlBeneficiarios}

                  <h3>Origem dos Fundos</h3>
                  ${htmlOrigemFundos}

                  <h3>Responsável Contábil</h3>
                  <p>
                    ${
                      parsedData.responsavelContabilidade 
                        ? parsedData.responsavelContabilidade.nome + " - " + parsedData.responsavelContabilidade.endereco 
                        : "N/A"
                    }
                  </p>

                  <h3>Documentos</h3>
                  <ul>
                    ${
                      parsedData.documentos && parsedData.documentos.length
                        ? parsedData.documentos
                            .map(
                              (doc: any, index: number) =>
                                `<li>${index + 1}. ${doc.title}</li>`
                            )
                            .join("")
                        : "<li>N/A</li>"
                    }
                  </ul>
              </div>
              <div class="footer">
                  <p>As informações deste email devem ser ultilizadas <strong>exclusimante</strong> para processos internos e/ou processos permitidos pelo cliente.</p>
                  <p>&copy; 2025 Abark Investments. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailFrom = process.env.EMAIL_FROM;
    const emailTo = process.env.EMAIL_TO;
    const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
    const emailPort = Number(process.env.EMAIL_PORT ?? 587);
    const emailSecure =
      process.env.EMAIL_SECURE !== undefined
        ? process.env.EMAIL_SECURE === "true"
        : emailPort === 465;

    if (!emailUser || !emailPass || !emailFrom || !emailTo || Number.isNaN(emailPort)) {
      return NextResponse.json(
        {
          message:
            "Configuração de e-mail incompleta. Verifique EMAIL_USER, EMAIL_PASS, EMAIL_FROM, EMAIL_TO e EMAIL_PORT.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailFrom,
      to: emailTo,
      subject: "Novo Formulário Enviado",
      text: JSON.stringify(parsedData, null, 2),
      html: htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({
      message: "Email enviado com sucesso",
      info,
      attachmentsSent: attachments.length,
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { message: "Erro ao enviar email", error },
      { status: 500 }
    );
  }
}
