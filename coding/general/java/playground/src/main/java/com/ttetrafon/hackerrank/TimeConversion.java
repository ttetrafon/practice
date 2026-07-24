package com.ttetrafon.hackerrank;

public class TimeConversion {
    public static String timeConversion(String s) {
        // 07:05:45PM -> 19:05:45
        // 12:40:22AM -> 00:40:22
        // 12:45:54PM -> 12:45:54
        String res = s.substring(2, 8);
        String note = s.substring(8);
        String hoursStr = s.substring(0, 2);

        if ("PM".equals(note) && !"12".equals(hoursStr)) {
            int hours = Integer.valueOf(hoursStr);
            res = String.valueOf(hours + 12) + res;
        }
        else if ("AM".equals(note) && "12".equals(hoursStr)) {
            res = "00" + res;
        }
        else {
            res = hoursStr + res;
        }

        return res;
    }
}
