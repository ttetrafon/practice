package com.ttetrafon.modals;

import android.app.Dialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.ttetrafon.modals.databinding.FragmentFirstBinding;

import java.util.concurrent.atomic.AtomicReference;

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
        AtomicReference<Dialog> dialog = null;

        binding.buttonFirst.setOnClickListener(v -> {
            FullScreenDialogue.show(
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
            );
                }
//                NavHostFragment.findNavController(FirstFragment.this)
//                        .navigate(R.id.action_FirstFragment_to_SecondFragment)
        );
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
