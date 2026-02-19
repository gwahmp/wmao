window.klaroConfig = {
    version: 1,
    elementID: 'klaro',
    privacyPolicy: '/legal#privacy',
    appName: 'Wikimint',
    mustConsent: true,
    noticeAsModal: false,  
  acceptAll: true,
    services: [
      {
        name: 'googleAnalytics',
        title: 'Google Analytics',
        purposes: ['analytics'],
        required: true,
      },
      {
        name: 'googleAdsense',
        title: 'Google AdSense',
        purposes: ['ads'],
        required: true,
      }
    ]
  };

    document.addEventListener("DOMContentLoaded", function() {
      if (typeof klaro !== "undefined") {
        klaro.setup(window.klaroConfig);
      }
    });
    
  document.addEventListener("klaro-consent", function(event) {
  
    if (event.detail.consents.googleAnalytics) {
      dataLayer.push({
        event: "analytics_consent_granted"
      });
  
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  
    if (event.detail.consents.googleAdsense) {
      dataLayer.push({
        event: "ads_consent_granted"
      });
  
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  
  });