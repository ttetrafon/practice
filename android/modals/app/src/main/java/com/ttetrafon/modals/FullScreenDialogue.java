package com.ttetrafon.modals;

import android.app.Dialog;
import android.content.Context;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;

public class FullScreenDialogue {
    public static void show(Context context, Runnable onYesClicked, Runnable onNoClicked) {
        // Create and configure the dialog
        Dialog dialog = new Dialog(context);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialogue_full_screen);
        dialog.getWindow().setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);

        // Configure "Yes" button
        Button yesButton = dialog.findViewById(R.id.button_yes);
        yesButton.setOnClickListener(v -> {
            if (onYesClicked != null) onYesClicked.run();
            dialog.dismiss();
        });

        // Configure "No" button
        Button noButton = dialog.findViewById(R.id.button_no);
        noButton.setOnClickListener(v -> {
            if (onNoClicked != null) onNoClicked.run();
            dialog.dismiss();
        });

        // Show the dialog
        dialog.show();
    }
}
