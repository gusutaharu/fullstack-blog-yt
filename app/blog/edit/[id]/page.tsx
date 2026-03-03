"use client";

import React, { use, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const editBlog = async (title: string, description: string, id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description, id }),
  });

  return res.json();
};

const getBlogById = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`);
  const data = await res.json();
  return data.post;
};

const deleteBlog = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

const EditBlog = ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    toast.loading("投稿を更新中...", { id: "edit" });
    await editBlog(titleRef.current!.value, descriptionRef.current!.value, id);
    toast.success("投稿が更新されました！", { id: "edit" });

    router.push("/");
    router.refresh();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    toast.loading("投稿を削除中...", { id: "delete" });
    await deleteBlog(id);
    toast.success("投稿が削除されました！", { id: "delete" });
  };

  useEffect(() => {
    getBlogById(id)
      .then((data) => {
        titleRef.current!.value = data.title;
        descriptionRef.current!.value = data.description;
      })
      .catch((err) => {
        toast.error("投稿の取得に失敗しました");
      });
  }, []);

  return (
    <>
      <Toaster />
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">
            ブログの編集 🚀
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="タイトルを入力"
              type="text"
              className="rounded-md px-4 w-full py-2 my-2"
            />
            <textarea
              ref={descriptionRef}
              placeholder="記事詳細を入力"
              className="rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              更新
            </button>
            <button
              onClick={handleDelete}
              className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
            >
              削除
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBlog;
