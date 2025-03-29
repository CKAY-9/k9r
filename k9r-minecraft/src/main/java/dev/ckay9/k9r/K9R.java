package dev.ckay9.k9r;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.bukkit.plugin.java.JavaPlugin;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import io.socket.client.IO;
import io.socket.client.Manager;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class K9R extends JavaPlugin {
    public URI websocket_uri = URI.create("http://127.0.0.1:8081");
    public URI api_uri = URI.create("http://127.0.0.1:8080/api/v1");
    public String server_key = "NO_SERVER_KEY";
    public Socket socket_client;
    public K9RServer server_details;
    Listeners listeners;

    @Override
    public void onEnable() {
        Config.initializeConfigFiles();
        websocket_uri = URI.create(Config.config.getString("k9r_websocket_host", "http://127.0.0.1:8081"));
        api_uri = URI.create(Config.config.getString("k9r_api_host", "http://127.0.0.1:8080") + "/api/v1");
        server_key = Config.config.getString("server_key");

        CloseableHttpClient http_client = HttpClients.createDefault();
        HttpGet get_request = new HttpGet(api_uri + "/game_server/auth");
        get_request.addHeader("Authorization", server_key);
        get_request.addHeader("Content-Type", "application/json");

        Gson gson = new Gson();

        try {
            CloseableHttpResponse response = http_client.execute(get_request);
            HttpEntity entity = response.getEntity();   

            if (entity != null) {
                String content = EntityUtils.toString(entity);
                K9RServer server = gson.fromJson(content, K9RServer.class);
                server_details = server;
            }
        } catch (UnsupportedEncodingException e) {
            Utils.getPlugin().getLogger().warning(e.toString());
        } catch (ClientProtocolException e) {
            Utils.getPlugin().getLogger().warning(e.toString());
        } catch (IOException e) {
            Utils.getPlugin().getLogger().warning(e.toString());
        } catch (JsonSyntaxException e) {
            Utils.getPlugin().getLogger().warning(e.toString());

            server_details = new K9RServer();
            server_details.id = -1;
            server_details.name = "invalid-server-0";
            server_details.description = "invalid server description";
        }

        if (server_details == null) {
            this.getLogger().warning("!!! K9R REQUIRES A VALID SERVER KEY BEFORE STARTING !!!");
            return;
        }

        IO.Options options = IO.Options.builder()
            .build();
        
        socket_client = IO.socket(websocket_uri, options);
        socket_client.io().on(Manager.EVENT_OPEN, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                Message message = new Message();

                message.sender = server_details.name + "-" + server_details.id;
                message.server_key = server_key;
                message.content = "join-room";
                message.room = server_details.name + "-" + server_details.id;

                socket_client.emit("join_room", gson.toJson(message));
            }
        });

        socket_client.connect();

        listeners = new Listeners(this);
        this.getServer().getPluginManager().registerEvents(listeners, this);
    }

    @Override
    public void onDisable() {

    }
}