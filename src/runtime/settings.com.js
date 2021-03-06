
function none() {
    // does nothing
}

function create(context) {
    
    var storage, story, settings, clone;
    
    var api = context.createInterface("settings", {
        load: load,
        save: save,
        update: mergeSettings,
        remove: remove,
        set: set,
        has: has,
        get: get,
        getAll: getAll
    });
    
    function init() {
        
        var defaultSettings;
        
        var getModule = context.channel("getModule").call;
        
        context.connectInterface(api);
        
        clone = getModule("clone");
        story = context.getInterface("story", ["getSettings"]);
        storage = context.getInterface("storage", ["load", "save"]);
        
        settings = {
            textSpeed: 50,
            soundVolume: 100,
            ambienceVolume: 100,
            musicVolume: 100,
            skipMainMenu: false,
            continueOnStart: true,
            useNextIndicator: true,
            useReturnIndicator: true,
            indicatorHint: 5000
        };
        
        defaultSettings = story.getSettings();
        
        Object.keys(defaultSettings).forEach(function (key) {
            settings[key] = defaultSettings[key];
        });
        
        api.load();
    }
    
    function destroy() {
        
        context.disconnectInterface(api);
        
        story = null;
        storage = null;
    }
    
    function set(name, value) {
        settings[name] = value;
        context.publish("update_setting", name);
    }
    
    function remove(name) {
        delete settings[name];
        context.publish("remove_setting", name);
    }
    
    function get(name) {
        return settings[name];
    }
    
    function getAll() {
        return clone(settings);
    }
    
    function has(name) {
        return (name in settings);
    }
    
    function load(then) {
        
        then = then || none;
        
        storage.load("settings", function (error, data) {
            
            if (error) {
                return then(error);
            }
            
            if (!data) {
                storage.save("settings", settings, function () {
                    then();
                });
            }
            else {
                mergeSettings(data.data);
                then();
            }
        });
    }
    
    function mergeSettings(other) {
        for (var key in other) {
            api.set(key, other[key]);
        }
    }
    
    function save(then) {
        
        then = then || none;
        
        storage.save("settings", api.getAll(), function () {
            then();
        });
    }
    
    return {
        init: init,
        destroy: destroy
    };
    
}

module.exports = {
    name: "settings",
    version: "2.0.0",
    application: "toothrot",
    applicationVersion: "2.x",
    applicationSteps: ["run"],
    environments: ["any"],
    create: create
};
