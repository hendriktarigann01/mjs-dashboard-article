/**
 * SuccessModal – reusable success screen for Create/Edit News & Project.
 *
 * Props:
 *  - title          {string}        Main heading text
 *  - subtitle       {string}        Optional subtitle below the heading
 *  - item           {object|null}   Preview data: { title, description, imageUrl }
 *                                   Pass null/undefined to hide the preview card.
 *  - primaryLabel   {string}        Label for the primary (teal filled) button
 *  - onPrimary      {() => void}    Handler for primary button click
 *  - secondaryLabel {string|null}   Label for the secondary (outlined) button
 *  - onSecondary    {() => void}    Handler for secondary button click (optional)
 */
const SuccessModal = ({
  title,
  subtitle,
  item,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}) => {
  const stripHtml = (html) =>
    html
      ?.replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim() ?? "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        {/* Check icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#3AAFA9] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#414853] text-center mb-1">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-gray-500 text-center mb-4">{subtitle}</p>
        )}

        {/* Preview card */}
        {item && (
          <>
            <hr className="border-gray-200 my-5" />
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-[120px] h-[80px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#414853] leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-xs text-[#9E9E9E] mt-1 line-clamp-2 leading-4">
                  {stripHtml(item.description)}
                </p>
                <p className="text-xs text-[#9E9E9E] mt-2">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <hr className="border-gray-200 my-5" />
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {secondaryLabel && onSecondary && (
            <button
              onClick={onSecondary}
              className="flex-1 border border-[#3AAFA9] text-[#3AAFA9] text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#E6F8F7] transition"
            >
              {secondaryLabel}
            </button>
          )}
          <button
            onClick={onPrimary}
            className="flex-1 bg-[#3AAFA9] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-teal-700 transition"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
