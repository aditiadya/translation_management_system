const VendorRatingCard = ({ rating }) => {
  const isEligible =
    rating &&
    rating.status === "COMPLETION_ACCEPTED" &&
    rating.score !== null &&
    rating.score !== undefined;

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      {/* Header */}
      <h3 className="text-base font-semibold text-gray-800">
        Vendor rating for this job
      </h3>

      {/* Not eligible / no data */}
      {!isEligible && (
        <div className="text-sm text-gray-500 border rounded-md p-4 bg-gray-50">
          Job must have completion accepted status before it can be rated.
        </div>
      )}

      {/* Rating */}
      {isEligible && (
        <div className="space-y-3">
          {/* Stars */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${
                  star <= rating.score
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-600">
              ({rating.score}/5)
            </span>
          </div>

          {/* Comment */}
          {rating.comment && (
            <div className="text-sm text-gray-700 border rounded-md p-3 bg-gray-50">
              {rating.comment}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorRatingCard;