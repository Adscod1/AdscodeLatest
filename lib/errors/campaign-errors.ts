/**
 * Campaign Type Error Classes
 * Custom error types for campaign type operations
 */

/**
 * Base error class for all campaign type errors
 */
export class CampaignTypeError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code: string, statusCode: number = 400, details?: any) {
    super(message);
    this.name = "CampaignTypeError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, CampaignTypeError.prototype);
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      ...(this.details && { details: this.details }),
    };
  }
}

/**
 * Error thrown when type-specific data is missing or invalid
 */
export class MissingTypeSpecificDataError extends CampaignTypeError {
  constructor(campaignType: string, details?: any) {
    super(
      `Type-specific data is required for ${campaignType} campaigns`,
      "MISSING_TYPE_SPECIFIC_DATA",
      400,
      details
    );
    this.name = "MissingTypeSpecificDataError";
  }
}

/**
 * Error thrown when type-specific data validation fails
 */
export class InvalidTypeSpecificDataError extends CampaignTypeError {
  constructor(campaignType: string, validationErrors: any[]) {
    super(
      `Invalid type-specific data for ${campaignType} campaign`,
      "INVALID_TYPE_SPECIFIC_DATA",
      400,
      validationErrors
    );
    this.name = "InvalidTypeSpecificDataError";
  }
}

/**
 * Error thrown when product reference is invalid
 */
export class InvalidProductReferenceError extends CampaignTypeError {
  constructor(productId?: string) {
    const reference = productId ? `productId: ${productId}` : 'unknown';
    super(
      `Product not found or doesn't belong to your store (${reference})`,
      "INVALID_PRODUCT_REFERENCE",
      404,
      { productId }
    );
    this.name = "InvalidProductReferenceError";
  }
}

/**
 * Error thrown when coupon reference is invalid
 */
export class InvalidCouponReferenceError extends CampaignTypeError {
  constructor(couponId?: string, couponCode?: string) {
    const reference = couponId ? `couponId: ${couponId}` : `couponCode: ${couponCode}`;
    super(
      `Coupon not found or invalid (${reference})`,
      "INVALID_COUPON_REFERENCE",
      404,
      { couponId, couponCode }
    );
    this.name = "InvalidCouponReferenceError";
  }
}

/**
 * Error thrown when video upload fails
 */
export class VideoUploadError extends CampaignTypeError {
  constructor(reason: string, details?: any) {
    super(
      `Video upload failed: ${reason}`,
      "VIDEO_UPLOAD_FAILED",
      500,
      details
    );
    this.name = "VideoUploadError";
  }
}

/**
 * Error thrown when video file is invalid
 */
export class InvalidVideoFileError extends CampaignTypeError {
  constructor(reason: string, details?: any) {
    super(
      `Invalid video file: ${reason}`,
      "INVALID_VIDEO_FILE",
      400,
      details
    );
    this.name = "InvalidVideoFileError";
  }
}

/**
 * Error thrown when campaign type is invalid or unsupported
 */
export class InvalidCampaignTypeError extends CampaignTypeError {
  constructor(type: string) {
    super(
      `Invalid campaign type: ${type}. Supported types: PRODUCT, COUPON, VIDEO, PROFILE`,
      "INVALID_CAMPAIGN_TYPE",
      400,
      { providedType: type, supportedTypes: ["PRODUCT", "DISCOUNT", "VIDEO", "PROFILE"] }
    );
    this.name = "InvalidCampaignTypeError";
  }
}

/**
 * Error thrown when attempting to change campaign type on non-draft campaigns
 */
export class CampaignTypeChangeNotAllowedError extends CampaignTypeError {
  constructor(currentStatus: string) {
    super(
      `Cannot change campaign type for ${currentStatus} campaigns. Only DRAFT campaigns can have their type changed.`,
      "TYPE_CHANGE_NOT_ALLOWED",
      403,
      { currentStatus }
    );
    this.name = "CampaignTypeChangeNotAllowedError";
  }
}

/**
 * Error thrown when JSON parsing fails
 */
export class JSONParseError extends CampaignTypeError {
  constructor(field: string, originalError?: any) {
    super(
      `Failed to parse JSON data for field: ${field}`,
      "JSON_PARSE_ERROR",
      400,
      { field, originalError: originalError?.message }
    );
    this.name = "JSONParseError";
  }
}

/**
 * Error thrown when database constraint is violated
 */
export class DatabaseConstraintError extends CampaignTypeError {
  constructor(constraint: string, details?: any) {
    super(
      `Database constraint violation: ${constraint}`,
      "DATABASE_CONSTRAINT_ERROR",
      409,
      details
    );
    this.name = "DatabaseConstraintError";
  }
}

/**
 * Error thrown when campaign not found
 */
export class CampaignNotFoundError extends CampaignTypeError {
  constructor(campaignId: string) {
    super(
      `Campaign not found: ${campaignId}`,
      "CAMPAIGN_NOT_FOUND",
      404,
      { campaignId }
    );
    this.name = "CampaignNotFoundError";
  }
}

/**
 * Error thrown when user doesn't have permission
 */
export class CampaignPermissionError extends CampaignTypeError {
  constructor(action: string) {
    super(
      `You don't have permission to ${action}`,
      "PERMISSION_DENIED",
      403,
      { action }
    );
    this.name = "CampaignPermissionError";
  }
}

/**
 * Utility function to check if error is a CampaignTypeError
 */
export function isCampaignTypeError(error: any): error is CampaignTypeError {
  return error instanceof CampaignTypeError;
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: any) {
  // If it's our custom error, use its JSON representation
  if (isCampaignTypeError(error)) {
    return {
      response: error.toJSON(),
      statusCode: error.statusCode,
    };
  }

  // Handle Prisma errors
  if (error.code === "P2002") {
    return {
      response: {
        success: false,
        error: "A campaign with this data already exists",
        code: "DUPLICATE_ENTRY",
      },
      statusCode: 409,
    };
  }

  if (error.code === "P2003") {
    return {
      response: {
        success: false,
        error: "Referenced record not found",
        code: "FOREIGN_KEY_CONSTRAINT",
      },
      statusCode: 404,
    };
  }

  if (error.code === "P2025") {
    return {
      response: {
        success: false,
        error: "Record not found",
        code: "NOT_FOUND",
      },
      statusCode: 404,
    };
  }

  // Handle Zod validation errors
  if (error.name === "ZodError") {
    return {
      response: {
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.errors,
      },
      statusCode: 400,
    };
  }

  // Generic error
  return {
    response: {
      success: false,
      error: error.message || "An unexpected error occurred",
      code: "INTERNAL_ERROR",
    },
    statusCode: 500,
  };
}

/**
 * Log error with appropriate level
 */
export function logCampaignError(error: any, context?: any) {
  const errorInfo = {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  // Log based on severity
  if (isCampaignTypeError(error) && error.statusCode < 500) {
    // Client errors (4xx) - info level
    console.info("Campaign validation error:", errorInfo);
  } else {
    // Server errors (5xx) - error level
    console.error("Campaign error:", errorInfo);
  }

  // In production, you would send this to a logging service like:
  // - Sentry
  // - LogRocket
  // - DataDog
  // - CloudWatch
}

/**
 * Validate that required type-specific data exists
 */
export function validateTypeSpecificDataExists(
  campaignType: string,
  typeSpecificData: any
): void {
  if (!typeSpecificData) {
    throw new MissingTypeSpecificDataError(campaignType);
  }

  // Type-specific validation
  switch (campaignType) {
    case "DISCOUNT":
      if (!typeSpecificData.couponId && !typeSpecificData.couponCode) {
        throw new InvalidTypeSpecificDataError(campaignType, [
          { message: "Either couponId or couponCode must be provided" },
        ]);
      }
      break;

    case "PRODUCT":
      if (!typeSpecificData.productId) {
        throw new InvalidTypeSpecificDataError(campaignType, [
          { message: "productId is required for PRODUCT campaigns" },
        ]);
      }
      break;

    case "VIDEO":
      if (!typeSpecificData.videoUrl) {
        throw new InvalidTypeSpecificDataError(campaignType, [
          { message: "videoUrl is required for VIDEO campaigns" },
        ]);
      }
      if (!typeSpecificData.videoCaption) {
        throw new InvalidTypeSpecificDataError(campaignType, [
          { message: "videoCaption is required for VIDEO campaigns" },
        ]);
      }
      break;

    case "PROFILE":
      if (!typeSpecificData.profileUrl) {
        throw new InvalidTypeSpecificDataError(campaignType, [
          { message: "profileUrl is required for PROFILE campaigns" },
        ]);
      }
      break;
  }
}
