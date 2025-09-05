import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ data }) => {
  // console.log('data', data);
  const navigate = useNavigate();

  const getText = (value, max = 120) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string")
      return value.length > max ? value.slice(0, max) + "..." : value;
    if (typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") {
      // try common fields
      if (value.name && typeof value.name === "string") return value.name;
      if (value.title && typeof value.title === "string") return value.title;
      if (value.content) return getText(value.content, max);
      try {
        return JSON.stringify(value).slice(0, max) + "...";
      } catch (e) {
        return "";
      }
    }
    return String(value);
  };

  const categoryLabel = data?.category?.name || getText(data?.category);
  const contentPreview = getText(data?.content, 150);
  const authorLabel = data?.author || getText(data?.createdBy) || "Unknown";
  const commentsCount = Array.isArray(data?.comments)
    ? data.comments.length
    : 0;
  const thumbnailSrc = data?.thumbnail?.secure_url || data?.previewImage || null;

  return (
    <div
      onClick={() => navigate("/blog/description", { state: { ...data } })}
      className="text-white w-[22rem] h-[430px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700"
    >
      <div className="overflow-hidden">
        {thumbnailSrc ? (
          <img
            className="h-48 w-full rounded-tl-lg rounded-tr-lg  group-hover:scale-[1.2]  transition-all ease-in-out duration-300 "
            src={thumbnailSrc}
            alt={getText(data?.title) || "blog thumbnail"}
          />
        ) : (
          <div className="h-48 w-full flex items-center justify-center bg-zinc-800 text-gray-300">
            <span className="p-4">No image</span>
          </div>
        )}
      </div>

      {/* blog details */}
      <div className="p-3 space-y-1 text-white">
        <h2 className="text-xl font-bold text-yellow-500 line-clamp-2">
          {getText(data?.title)}
        </h2>
        <p className="line-clamp-2">{contentPreview}</p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Author : </span>
          {authorLabel}
        </p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Created By : </span>
          {getText(data?.createdBy)}
        </p>
        <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Category : </span>
          {categoryLabel}
        </p>
        {/* <p className="font-semibold">
          <span className="text-yellow-500 font-bold">Comments : </span>
          {commentsCount}
        </p> */}
      </div>
    </div>
  );
};

export default BlogCard;
