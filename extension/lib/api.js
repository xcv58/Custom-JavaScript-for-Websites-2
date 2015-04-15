(function(chrome) {
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        switch(request.method) {
            case 'setData':
                localStorage['customjs'] = JSON.stringify(request.customjs);
            case 'getData':
                var customjs = JSON.parse(localStorage['customjs'] || 'false');
                sendResponse({customjs: customjs, host: location.host, protocol: location.protocol});
                break;
            case 'removeData':
                delete localStorage['customjs'];
                break;
            case 'goTo':
                window.location = request.link;
                break;
            default:
                sendResponse({src: '', config: {}});
        }
        if( request.reload ) {
            window.location.reload();
        }
    });

})(chrome);
