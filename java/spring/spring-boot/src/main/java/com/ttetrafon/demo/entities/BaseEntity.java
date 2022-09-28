package com.ttetrafon.demo.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;
import java.io.Serializable;
import java.time.Instant;

@MappedSuperclass
@Data
public abstract class BaseEntity implements Serializable {

  @Schema(
      description = "The creation date of the entity.",
      example = "2021-05-07T11:17:08.299489Z",
      accessMode = Schema.AccessMode.READ_ONLY,
      hidden = true)
  @CreationTimestamp
  @Column(name = "creation_date")
  private Instant creationDate;

  @Schema(
      description =
          "The time that this entity was last modified or created, whichever is more recent.",
      example = "2021-05-07T11:17:08.299489Z",
      accessMode = Schema.AccessMode.READ_ONLY,
      hidden = true)
  @UpdateTimestamp
  @Column(name = "modified_date")
  @JsonFormat()
  private Instant modifiedDate;

  @Schema(
      description = "Conditional of if this entity is deleted.",
      example = "false",
      accessMode = Schema.AccessMode.READ_ONLY,
      hidden = true)
  @Column(name = "deleted")
  private boolean deleted;

  @Schema(
      description =
          "The current version of this entity. It will start at 1, and be incremented on every UPDATE on this entity.",
      hidden = true,
      example = "1",
      accessMode = Schema.AccessMode.READ_ONLY)
  @Version
  @Column(name = "oca")
  private int oca;
}
