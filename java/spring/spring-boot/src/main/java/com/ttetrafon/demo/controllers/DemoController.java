package com.ttetrafon.demo.controllers;

import com.ttetrafon.demo.exceptions.ApiResponseError;
import com.ttetrafon.demo.models.requessts.DemoRequestObject;
import com.ttetrafon.demo.models.responses.DemoResponseObject;
import com.ttetrafon.demo.services.DemoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/demo/v1", consumes = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "HandleDemoRequest", description = "Handles a demo request!")
@Validated
@Slf4j
public class DemoController {
    @Autowired private DemoService demoService;

    @Operation(operationId = "HandleDemoRequest", summary = "Handles a demo request!")
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Success",
                            content = {
                                    @Content(
                                            mediaType = "application/json",
                                            schema =@Schema(implementation = DemoResponseObject.class)
                                    )
                            }
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Bad request body.",
                            content = {
                                    @Content(
                                            mediaType = "application/json",
                                            schema = @Schema(implementation = ApiResponseError.class))
                            }),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Failed to send request to BNPP, service failure.",
                            content = {
                                    @Content(
                                            mediaType = "application/json",
                                            schema = @Schema(implementation = ApiResponseError.class))
                            })

            }
    )
    @PostMapping(path = "/demo-controller/{id}")
    public DemoResponseObject HandleDemoRequest(
            @RequestHeader HttpHeaders headers,
            @PathVariable UUID id,
            @RequestBody DemoRequestObject request
            ) {
        log.info("---> HandleDemoRequest()");
        return demoService.handleDemoRequest(headers, id, request);
    }
}
