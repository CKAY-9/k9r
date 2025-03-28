package dev.k9r;

import java.io.File;
import java.io.IOException;

import org.bukkit.configuration.file.YamlConfiguration;

public class Config {
    public static File config_file;
    public static YamlConfiguration config;

    public static void initializeConfigFiles() { 
        try {
            config_file = new File(Utils.getPlugin().getDataFolder(), "config.yml");
            if (!config_file.exists()) {
                if (config_file.getParentFile().mkdirs()) {
                    Utils.getPlugin().getLogger().info("Created K9R folder");
                }
                if (config_file.createNewFile()) {
                    Utils.getPlugin().getLogger().info("Created config file");
                }
            }

            if (!config.isSet("k9r_websocket_host")) {
                config.set("k9r_websocket_host", "http://127.0.0.1:8081");
            }
            if (!config.isSet("k9r_server_key")) {
                config.set("k9r_server_key", "NO_SERVER_KEY");
            }
        } catch (IOException ex) {
            Utils.getPlugin().getLogger().warning(ex.toString());
        }
    }
}
