package dev.ckay9.k9r;

import java.net.URI;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

import io.socket.client.Manager;
import io.socket.emitter.Emitter;

public class K9RCommand implements CommandExecutor {
    K9R k9r;

    public K9RCommand(K9R k9r) {
        this.k9r = k9r;
    }

    private void reconnect(CommandSender sender) {
        sender.sendMessage(Utils.formatText("&eAttempting to get server details..."));
        this.k9r.getK9RServerDetails();
        if (this.k9r.server_details == null) {
            sender.sendMessage(Utils.formatText("&cFailed to get server details! Check server console."));
            return;
        }

        sender.sendMessage(Utils.formatText("&aFetched server details!"));

        sender.sendMessage(Utils.formatText("&eAttempting to connect to K9R socket host..."));
        this.k9r.connectToK9RSocket();
        this.k9r.socket_client.io().on(Manager.EVENT_OPEN, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                sender.sendMessage(Utils.formatText("&aConnected to K9R!"));
            }
        });

        this.k9r.socket_client.io().on(Manager.EVENT_ERROR, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                sender.sendMessage(Utils.formatText("&cFailed to connect to K9R!"));
            }
        });
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!sender.isOp()) {
            sender.sendMessage(Utils.formatText("&cThis command is for admins only."));
            return false;
        }

        if (args.length == 0) {
            sender.sendMessage(
                Utils.formatText("&aK9R Commands: "));
            sender.sendMessage(
                Utils.formatText("&a - /k9r server_key YOUR_SERVER_KEY: will set your current server key"));
            sender.sendMessage(
                Utils.formatText("&a - /k9r socket_host YOUR_SOCKET_HOST: will set your current socket host"));
            sender.sendMessage(
                Utils.formatText("&a - /k9r api_host YOUR_CURRENT_SOCKET: will set your current api host"));
            sender.sendMessage(
                Utils.formatText("&a - /k9r reconnect: will attempt to connect to K9R socket server"));
            return false;
        }

        switch (args[0].toLowerCase().strip()) {
            case "server_key":
                Config.setConfig("server_key", args[1].strip());
                this.k9r.server_key = args[1].strip();
                sender.sendMessage(Utils.formatText("&aSet server key!"));
                break;
            case "socket_host":
                Config.setConfig("k9r_websocket_host", args[1].strip());
                this.k9r.websocket_uri = URI.create(args[1].strip());
                sender.sendMessage(Utils.formatText("&aSet websocket host!"));
                break;
            case "api_host":
                Config.setConfig("k9r_api_host", args[1].strip());
                this.k9r.api_uri = URI.create(args[1].strip() + "/api/v1");
                sender.sendMessage(Utils.formatText("&aSet API host!"));
                break;
            case "reconnect":
                reconnect(sender);
                break;
            default:
                break;
        }

        return false;
    }
}
