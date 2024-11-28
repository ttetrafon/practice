LOCAL ?= false
LOCAL_SERVICES := alpha gamma

# A makefile is parsed at read, so dynamically updated variables need to be used inside recipies.

test-%: SERVICE=$(*)
test-%:
	@echo "Starting... local=$(LOCAL); service=$(SERVICE)"
	@if [ "$(LOCAL)" = "true" ] && echo "$(LOCAL_SERVICES)" | grep -qw "$(SERVICE)"; then \
		echo "service has local implementation"; \
	else \
		echo "service does not have local implementation"; \
	fi

test: test-alpha test-beta test-gamma
