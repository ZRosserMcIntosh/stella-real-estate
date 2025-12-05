import { Helmet } from 'react-helmet-async'

/**
 * Google Tag Manager component specifically for Constellation subdomain pages
 * GTM ID: GTM-P6B27MKZ
 */
export function ConstellationGTMHead() {
  return (
    <Helmet>
      {/* Google Tag Manager */}
      <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P6B27MKZ');`}</script>
      {/* End Google Tag Manager */}
    </Helmet>
  )
}

export function ConstellationGTMBody() {
  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P6B27MKZ"
height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
      {/* End Google Tag Manager (noscript) */}
    </>
  )
}
