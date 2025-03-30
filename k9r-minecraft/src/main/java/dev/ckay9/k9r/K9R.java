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
import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import dev.ckay9.k9r.Models.K9RServer;
import dev.ckay9.k9r.Models.Message;
import dev.ckay9.k9r.Models.PlayerChat;
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

    public void connectToK9RSocket() {
        if (server_details == null) {
            this.getLogger().warning("!!! K9R REQUIRES A VALID SERVER KEY BEFORE CONNECTING !!!");
            return;
        }

        IO.Options options = IO.Options.builder()
                .build();

        socket_client = IO.socket(websocket_uri, options);
        socket_client.io().on(Manager.EVENT_OPEN, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                sendSocketMessage("join_room", "join-room");
            }
        });

        socket_client.on("send_chat_message", args -> {
            String data = (String)args[0];
            this.getLogger().info(data);

            Gson gson = new Gson();
            Message parsed = gson.fromJson(data, Message.class);
            PlayerChat chat_message = gson.fromJson(parsed.content, PlayerChat.class);

            Bukkit.broadcastMessage(Utils.formatText("&1&l[K9R]&r &d<" + chat_message.display_name + ">&r " + chat_message.message));
        });

        socket_client.connect();

        listeners = new Listeners(this);
        this.getServer().getPluginManager().registerEvents(listeners, this);
    }

    public void getK9RServerDetails() {
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
                this.getLogger().info("Response from authentication API: " + content);

                if (response.getStatusLine().getStatusCode() == 200) {
                    K9RServer server = gson.fromJson(content, K9RServer.class);
                    server_details = server;
                    return;
                }

                server_details = null;
            }
        } catch (UnsupportedEncodingException e) {
            Utils.getPlugin().getLogger().warning(e.toString());
        } catch (ClientProtocolException e) {
            Utils.getPlugin().getLogger().warning(e.toString());
        } catch (IOException e) {
            Utils.getPlugin().getLogger().warning(e.toString());
        } catch (JsonSyntaxException e) {
            Utils.getPlugin().getLogger().warning(e.toString());
        }
    }

    public void sendSocketMessage(String event, String content) {
        Gson gson = new Gson();
        Message message = new Message();
        message.sender = this.server_details.name + "-" + this.server_details.id;
        message.server_key = this.server_key;
        message.room = this.server_details.name + "-" + this.server_details.id;
        message.content = content;
        this.socket_client.emit(event, gson.toJson(message, Message.class));
    }

    public void sendSocketMessage(String event, String content, String room) {
        Gson gson = new Gson();
        Message message = new Message();
        message.sender = this.server_details.name + "-" + this.server_details.id;
        message.server_key = this.server_key;
        message.room = room;
        message.content = content;
        this.socket_client.emit(event, gson.toJson(message, Message.class));
    }

    @Override
    public void onEnable() {
        Config.initializeConfigFiles();
        websocket_uri = URI.create(Config.config.getString("k9r_websocket_host", "http://127.0.0.1:8081"));
        api_uri = URI.create(Config.config.getString("k9r_api_host", "http://127.0.0.1:8080") + "/api/v1");
        server_key = Config.config.getString("server_key");

        this.getCommand("k9r").setExecutor(new K9RCommand(this));
        this.getCommand("k9r").setTabCompleter(new K9RCompleter(this));

        getK9RServerDetails();
        connectToK9RSocket();
    }

    @Override
    public void onDisable() {
        this.socket_client.close();
    }
}