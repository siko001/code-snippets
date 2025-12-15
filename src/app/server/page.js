import ServerSnippets from "@/app/components/server/ServerSnippets";
import Script from 'next/script';
export default function ServerPage() {

  const embedCode = `
    <iframe 
      id="booking-widget-iframe"
      src="http://localhost:6969/book/banana-ride"
      width="100%" 
      height="800px"
      allow="payment"
      style="border: none; min-height: 400px;"
    ></iframe>
  `;

  return (
    <div className="w-full">
      <ServerSnippets />


      {/* <div className="mt-40">
        <div>
          <div dangerouslySetInnerHTML={{ __html: embedCode }} />
          <Script src="http://localhost:6969/booking-widget.js" strategy="afterInteractive" />
        </div>
      </div> */}
    </div>
  );
}
