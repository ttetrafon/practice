package com.ttetrafon.modals;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.ttetrafon.modals.databinding.FragmentFirstBinding;

public class FirstFragment extends Fragment {

    private FragmentFirstBinding binding;

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {

        binding = FragmentFirstBinding.inflate(inflater, container, false);
        return binding.getRoot();

    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        binding.buttonFirst.setOnClickListener(v -> {
            new Handler(Looper.getMainLooper()).postDelayed(() -> FullScreenDialogue.show(
                    getContext(),
                    () -> {
                        System.out.println("Yes...!!!");
                        // Handle "Yes" action
                        Toast.makeText(getContext(), "Yes clicked!", Toast.LENGTH_SHORT).show();
                    },
                    () -> {
                        System.out.println("No...!!!");
                        // Handle "No" action
                        Toast.makeText(getContext(), "No clicked!", Toast.LENGTH_SHORT).show();
                    }
            ), 100);
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
