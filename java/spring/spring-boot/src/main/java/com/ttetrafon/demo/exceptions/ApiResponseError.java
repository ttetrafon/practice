package com.ttetrafon.demo.exceptions;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseError {
  @Schema(description = "Error message", example = "Something went wrong")
  private String message;

  @Schema(description = "Error code", example = "100")
  private int code;

  @Schema(description = "HTTP response status", example = "500")
  private HttpStatus httpStatus;

  @Schema(description = "Which fields are causing the error")
  private FieldError[] fieldErrors;
}
