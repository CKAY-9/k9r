package dev.k9r;

import java.net.URI;

import org.bukkit.plugin.java.JavaPlugin;

import io.socket.client.IO;
import io.socket.client.Socket;

public class K9R extends JavaPlugin {
    URI uri = URI.create("http://127.0.0.1:8081");
    String server_key = "NO_SERVER_KEY";
    Socket socket_client;

    @Override
    public void onEnable() {
        Config.initializeConfigFiles();
        uri = URI.create(Config.config.getString("k9r_websocket_host"));
        server_key = Config.config.getString("k9r_server_key");

        IO.Options options = IO.Options.builder()
            .build();
        
        socket_client = IO.socket(uri, options);
    }

    @Override
    public void onDisable() {

    }
}