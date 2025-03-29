package dev.ckay9.k9r;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;

public class K9RCompleter implements TabCompleter {
    K9R k9r;

    public K9RCompleter(K9R k9r) {
        this.k9r = k9r;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String label, String[] args) {
        if (!sender.isOp()) {
            return Collections.emptyList();
        }

        if (args.length == 1) {
            ArrayList<String> completers = new ArrayList<>();
            completers.add("server_key");
            completers.add("socket_host");
            completers.add("api_host");
            completers.add("reconnect");
            return completers;
        }

        return Collections.emptyList();
    }
}
