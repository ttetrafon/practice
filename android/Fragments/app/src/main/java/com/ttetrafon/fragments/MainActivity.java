package com.ttetrafon.fragments;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentManager;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

/**
 * https://developer.android.com/guide/fragments
 *
 * Fragments have the following properties:
 * - can be only children to an activity
 * - their own layout and behaviour
 * - their own lifecycle (onAttach, onCreate, onCreateView, onActivityCreated, onStart,
 *      onResume, onPause, onStop, onDestroyView, onDestroy)
 * - can be added/removed at any point during their activity's lifecycle
 * - the same fragment can be used with multiple different activities
 * - can implement behaviours without UI
 * - (minimum API 30)
 *
 * Fragments are added within a 'fragment_view' in the layout.
 *
 * Types of Fragments:
 * - single frame: only one fragment shown as a view
 * - list: have a list view (like a menu)
 * - transaction: move one fragment to another
 */
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.d("...", "---> MainActivity.onCreate()");

        Button buttonNews = (Button) findViewById(R.id.buttonNews);
        Button buttonMap = (Button) findViewById(R.id.buttonMap);
        Button buttonSettings = (Button) findViewById(R.id.buttonSettings);

        // Fragments are switched with the help of 'Fragment Manager'.
        // https://developer.android.com/guide/fragments/fragmentmanager
        FragmentManager fragmentManager = getSupportFragmentManager();

        buttonNews.setOnClickListener(view -> replaceFragment(fragmentManager, FragmentNews.class));
        buttonMap.setOnClickListener(view -> replaceFragment(fragmentManager, FragmentMap.class));
        buttonSettings.setOnClickListener(view -> replaceFragment(fragmentManager, FragmentSettings.class));
    }

    public boolean replaceFragment(FragmentManager fragmentManager, Class<? extends androidx.fragment.app.Fragment> fragmentClass) {
        Log.d("...", "---> replaceFragment()");
        fragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, fragmentClass, null)
                .setReorderingAllowed(true)
                .addToBackStack("settings")
                .commit();
        return true;
    }
}
