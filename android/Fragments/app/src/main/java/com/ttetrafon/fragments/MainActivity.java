package com.ttetrafon.fragments;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

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
    }
}