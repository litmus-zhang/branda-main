import { Chromiumly, HtmlConverter, PDFEngines, } from "chromiumly";
import { config } from "../config.ts"

Chromiumly.configure({
    endpoint: config.GOTENBERG_ENDPOINT,
    username: "user",
    password: "pass",
});

export async function generatePdf(event_name: string, templatePath: string = "../templates/ticket.html") {
    const htmlConverter = new HtmlConverter();
    const buffer = await htmlConverter.convert({
        html: templatePath,
    });

    return PDFEngines.generate(`${event_name}-ticket.pdf`, buffer);

}


export async function generatePdfFromHtml(html: string, event_name: string): Promise<void> {
    //   const formData = new FormData();

    //   formData.append(
    //     "files",
    //     new Blob([html], { type: "text/html" }),
    //     "index.html"
    //   );

    //   // Optional Chromium flags
    //   formData.append("paperWidth", "8.27");
    //   formData.append("paperHeight", "11.69");
    //   formData.append("marginTop", "0");
    //   formData.append("marginBottom", "0");
    //   formData.append("marginLeft", "0");
    //   formData.append("marginRight", "0");

    //   const res = await fetch(
    //     `${process.env.GOTENBERG_URL}/forms/chromium/convert/html`,
    //     {
    //       method: "POST",
    //       body: formData,
    //     }
    //   );

    //   if (!res.ok) {
    //     const err = await res.text();
    //     throw new Error(`Gotenberg PDF generation failed: ${err}`);
    //   }

    //   const arrayBuffer = await res.arrayBuffer();
    //   return Buffer.from(arrayBuffer);
    const htmlConverter = new HtmlConverter();
    const buffer = await htmlConverter.convert({
        html: html,
    });

    return PDFEngines.generate(`${event_name}-ticket.pdf`, buffer);

}
