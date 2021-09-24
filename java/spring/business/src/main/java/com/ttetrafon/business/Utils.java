package com.ttetrafon.business;

import java.net.URL;

import com.ttetrafon.business.controller.LoginController;

public class Utils {
	
	public static String getVersion() {
		String res = "Unknown version";
		try {
			final URL url = LoginController.class.getResource("LoginController.class");
			final String className = url.getFile();
//			String filePath = className.substring(0, className.indexOf("WEB-INF")) + "META-INF/MANIFEST.MF";
			res = className;
		}
		catch (Exception exc) {
			exc.printStackTrace();
		}
		return res;
	}
	
}
