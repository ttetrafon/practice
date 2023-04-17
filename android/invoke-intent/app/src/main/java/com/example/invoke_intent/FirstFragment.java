package com.example.invoke_intent;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;

import androidx.navigation.fragment.NavHostFragment;

import com.example.invoke_intent.databinding.FragmentFirstBinding;

public class FirstFragment extends Fragment {

  private FragmentFirstBinding binding;

  @Override
  public View onCreateView(
      LayoutInflater inflater, ViewGroup container,
      Bundle savedInstanceState
  ) {

    binding = FragmentFirstBinding.inflate(inflater, container, false);
    return binding.getRoot();

  }

  public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
    super.onViewCreated(view, savedInstanceState);

    binding.buttonFirst.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        NavHostFragment.findNavController(FirstFragment.this)
            .navigate(R.id.action_FirstFragment_to_SecondFragment);
      }
    });

    binding.buttonInvokeIntent.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        binding.textViewResult.setText("Called intent!\nWaiting for result...");
        Intent intent = new Intent(Intent.ACTION_SEND);
        try {
          startActivity(intent);
        }
        catch (Exception exc) {
          exc.printStackTrace();
          binding.textViewResult.setText("Failed to find intent :(");
        }
      }
    });
  }

  @Override
  public void onDestroyView() {
    super.onDestroyView();
    binding = null;
  }

}