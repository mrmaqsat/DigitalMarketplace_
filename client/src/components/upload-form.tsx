import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ICategory } from "@shared/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, FileText, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const uploadSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  price: z.string().min(1, "Цена обязательна"),
  categoryId: z.string().min(1, "Категория обязательна"),
});

type UploadData = z.infer<typeof uploadSchema>;

interface UploadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadForm({ isOpen, onClose }: UploadFormProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<ICategory[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<UploadData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryId: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("categoryId", data.categoryId);

      selectedImages.forEach((file) => formData.append("images", file));
      selectedFiles.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to upload product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/products"] });
      toast({
        title: "Товар успешно загружен!",
        description: "Ваш товар ожидает одобрения.",
      });
      onClose();
      form.reset();
      setSelectedImages([]);
      setSelectedFiles([]);
    },
    onError: () => {
      toast({
        title: "Ошибка загрузки",
        description: "Произошла ошибка при загрузке вашего товара.",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setSelectedImages(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10);
      setSelectedFiles(files);
    }
  };

  const onSubmit = (data: UploadData) => {
    if (selectedImages.length === 0) {
      toast({
        title: "Требуются изображения",
        description: "Пожалуйста, загрузите хотя бы одно изображение товара.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "Требуются файлы",
        description: "Пожалуйста, загрузите хотя бы один цифровой файл.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-full overflow-y-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Загрузить новый товар</CardTitle>
                <CardDescription>
                  Добавить новый цифровой товар в ваш магазин
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Название товара</Label>
                <Input id="title" {...form.register("title")} placeholder="Введите название товара" />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Опишите ваш товар"
                  rows={4}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Цена ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register("price")}
                    placeholder="29.99"
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select
                    onValueChange={(value) => form.setValue("categoryId", value)}
                    disabled={!categories || categories.length === 0}
                  >
                    <SelectTrigger className={!categories?.length ? "cursor-not-allowed opacity-50" : ""}>
                      <SelectValue
                        placeholder={
                          categories?.length ? "Выберите категорию" : "Категории недоступны"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category._id} value={category._id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">Категории недоступны</div>
                      )}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop images here, or click to select (max 5)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Select Images
                  </Button>
                </div>
                {selectedImages.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {selectedImages.length} image(s) selected:{" "}
                    {selectedImages.map((f) => f.name).join(", ")}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Digital Files</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Upload your digital product files (ZIP, PDF, etc.) (max 10)
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Select Files
                  </Button>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {selectedFiles.length} file(s) selected:{" "}
                    {selectedFiles.map((f) => f.name).join(", ")}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
