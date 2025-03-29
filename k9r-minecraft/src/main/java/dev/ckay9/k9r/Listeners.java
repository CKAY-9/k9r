package dev.ckay9.k9r;

import java.util.ArrayList;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerChatEvent;

import com.google.gson.Gson;

class PlayerData {
    String uuid;
    String username;
    String display_name;
    boolean admin;

    public PlayerData(String uuid, String username, String display_name, boolean admin) {
        this.uuid = uuid;
        this.username = username;
        this.display_name = display_name;
        this.admin = admin;
    }
}

class PlayerMessage {
    String uuid;
    String username;
    String display_name;
    String message;
    String world_name;
}

class RegularUpdate {
    int player_count;
    ArrayList<PlayerData> players;
}

public class Listeners implements Listener {
    K9R k9r;

    public Listeners(K9R k9r) {
        this.k9r = k9r;

        int update_interval = Config.config.getInt("update_interval", 3) * 20;
        k9r.getServer().getScheduler().scheduleSyncRepeatingTask(k9r, new Runnable() {
            @Override
            public void run() {
                // Regular update
                RegularUpdate update = new RegularUpdate();
                update.players = new ArrayList<>();
                for (Player player : Bukkit.getOnlinePlayers()) {
                    update.players.add(new PlayerData(player.getUniqueId().toString(), player.getName(), player.getDisplayName(), player.isOp()));
                }

                update.player_count = Bukkit.getOnlinePlayers().size();
                Gson gson = new Gson();
                String update_string = gson.toJson(update);

                // TODO: move this into a dedicated function
                Message message = new Message();
                message.sender = k9r.server_details.name + "-" + k9r.server_details.id;
                message.server_key = k9r.server_key;
                message.content = update_string;
                message.room = k9r.server_details.name + "-" + k9r.server_details.id;
            
                k9r.socket_client.emit("update_interval", gson.toJson(message, Message.class));
            }
        }, 0L, update_interval);
    }

    @EventHandler(priority = EventPriority.HIGH)
    public void onPlayerChat(AsyncPlayerChatEvent event) {
        Player player = event.getPlayer();
        String chat_message = event.getMessage();

        // TODO: move this into a dedicated function
        PlayerMessage player_message = new PlayerMessage();
        player_message.uuid = player.getUniqueId().toString();
        player_message.username = player.getName();
        player_message.display_name = player.getDisplayName();
        player_message.message = chat_message;
        player_message.world_name = player.getWorld().getName();

        Gson gson = new Gson();
        String player_message_string = gson.toJson(player_message, PlayerMessage.class);

        Message message = new Message();
        message.sender = k9r.server_details.name + "-" + k9r.server_details.id;
        message.server_key = k9r.server_key;
        message.content = player_message_string;
        message.room = k9r.server_details.name + "-" + k9r.server_details.id;

        k9r.socket_client.emit("player_chat", gson.toJson(message, Message.class));
    }
}
