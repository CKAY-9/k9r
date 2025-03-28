package dev.k9r;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;

public class Utils {
    public static String formatText(String s) {
        return ChatColor.translateAlternateColorCodes('&', s);
    }

    public static K9R getPlugin() {
        return (K9R) Bukkit.getPluginManager().getPlugin("DuelCraft");
    }
}
