package main

import "testing"

func TestPatchUser(t *testing.T) {
	cases := []struct {
		name     string
		initial  User
		updates  UpdateSettings
		expected User
	}{
		{
			name: "Update all fields with new values",
			initial: User{
				Username: "Alice", RetryLimit: 5, IsActive: true,
			},
			updates: UpdateSettings{
				RetryLimit: new(0),
				IsActive:   new(false),
			},
			expected: User{
				Username: "Alice", RetryLimit: 0, IsActive: false,
			},
		},
		{
			name: "Update only RetryLimit",
			initial: User{
				Username: "Alice", RetryLimit: 5, IsActive: true,
			},
			updates: UpdateSettings{
				RetryLimit: new(0),
			},
			expected: User{
				Username: "Alice", RetryLimit: 0, IsActive: true,
			},
		},
		{
			name: "Update only IsActive",
			initial: User{
				Username: "Alice", RetryLimit: 5, IsActive: true,
			},
			updates: UpdateSettings{
				IsActive: new(false),
			},
			expected: User{
				Username: "Alice", RetryLimit: 5, IsActive: false,
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			user := tc.initial
			PatchUser(&user, tc.updates)
			if user != tc.expected {
				t.Errorf("got: %+v, expected: %+v", user, tc.expected)
			}
		})
	}
}

// go test ./...
