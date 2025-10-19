export const sitePaidTemplate = (
  coupleName: string,
  siteUrl: string,
  qrCodeBase64: string,
) => `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h2>🎉 Seu site está pronto, ${coupleName}!</h2>
    <p>Agora vocês podem compartilhar o link do site com seus convidados:</p>
    <a href="${siteUrl}" style="display: inline-block; padding: 10px 20px; background-color: #ff4081; color: white; text-decoration: none; border-radius: 5px;">
      Acessar Site
    </a>
    <p>Ou use o QR Code abaixo:</p>
    <img src="${qrCodeBase64}" alt="QR Code" style="margin-top: 10px; width: 200px;" />
  </div>
`;
