package org.example.hrappbackend.util;

import lombok.experimental.UtilityClass;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

@UtilityClass
public class SanitizerUtil {
    public static String sanitize(String input) {
        if (input == null || input.isBlank()) {
            return input;
        }
        return Jsoup.clean(input, Safelist.none());
    }
}