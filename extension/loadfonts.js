
extensionId = api('createDialog',{title:'getId'})[0].id.split('-')[2]; // really bad hack to get the extension id ;)
extension = easyeda.extension.instances[extensionId];
extension.opentypeFontCache = new Array();
extension.updateFontsCache = () => {    
    var request = window.indexedDB.open('DBEasyEDA');
    request.onerror = function(event) {
        console.error("Failed to open database");
    };
    request.onsuccess = function(event) {
        db = request.result;
        objectStore = db.transaction("fonts","readwrite").objectStore("fonts");
        // Put Default-Font into Database
        objectStore.put(defaultFont,'Liberation Sans Bold');
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                //console.log("Name for SSN " + cursor.key + " is " + cursor.value);           
                if(extension.opentypeFontCache.filter(f=>f.key==cursor.key).length==0) {
                    // font is not yet in fonts cache, add it
                    font = opentype.parse(cursor.value);
                    font.key = cursor.key;
                    font.buffer = cursor.value;
                    font.logBuffer = ()=>{
                        v = new Uint8Array(font.buffer);
                        console.log('x = new Uint8Array(['+v.join(',') +']).buffer');
                    }
                    extension.opentypeFontCache.push(font);
                }
                cursor.continue();
            }
          };
    };    
}
extension.updateFontsCache();