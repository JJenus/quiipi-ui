// src/pages/Projects.tsx (updated)
import React, { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Search, Plus, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { formatDate, getDaysUntil } from "@/utils/dateUtils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollableDialog } from "@/components/ui/scrollable-dialog";

export const Projects: React.FC = () => {
	const [search, setSearch] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const { projects, isLoading, createProject } = useProjects();
	const navigate = useNavigate();
	const isMobile = useMediaQuery("(max-width: 768px)");

	const getStatusColor = (status: string) => {
		const colors: Record<string, string> = {
			PLANNING:
				"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
			IN_PROGRESS:
				"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
			ON_HOLD:
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
			COMPLETED:
				"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
			CANCELLED:
				"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	const getPriorityColor = (priority: string) => {
		const colors: Record<string, string> = {
			LOW: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
			MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
			HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
			CRITICAL:
				"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
		};
		return colors[priority] || "bg-gray-100 text-gray-800";
	};

	const filteredProjects = (Array.isArray(projects) ? projects : []).filter(
		(project) =>
			project.name.toLowerCase().includes(search.toLowerCase()) ||
			project.client?.companyName
				?.toLowerCase()
				.includes(search.toLowerCase())
	);

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Manage and track your projects.
					</p>
				</div>

				{/* Button triggers the dialog */}
				<Button
					className="w-full sm:w-auto"
					onClick={() => setIsCreateDialogOpen(true)}
				>
					<Plus className="mr-2 h-4 w-4" />
					New Project
				</Button>

				{/* Then the ScrollableDialog separately */}
				<ScrollableDialog
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					title="Create New Project"
					description="Fill in the details to create a new project"
					className="sm:max-w-[900px]"
				>
					<ProjectForm
						onSubmit={async (data) => {
							await createProject(data);
							setIsCreateDialogOpen(false);
						}}
						onCancel={() => setIsCreateDialogOpen(false)}
					/>
				</ScrollableDialog>
			</div>

			{/* Search */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder={
						isMobile
							? "Search projects..."
							: "Search projects by name or client..."
					}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-9 pr-4 w-full"
				/>
			</div>

			{/* Projects Grid */}
			{isLoading ? (
				<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className="h-48 w-full" />
					))}
				</div>
			) : filteredProjects.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
						<p className="text-lg font-medium text-center">
							No projects found
						</p>
						<p className="text-sm text-muted-foreground text-center mt-1 mb-4">
							{search
								? "Try adjusting your search"
								: "Get started by creating your first project"}
						</p>
						{!search && (
							<Button onClick={() => setIsCreateDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Create Project
							</Button>
						)}
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{filteredProjects.map((project) => {
						const daysUntil = getDaysUntil(project.deadline);
						const isNearDeadline = daysUntil <= 7 && daysUntil > 0;

						return (
							<Card
								key={project.id}
								className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
								onClick={() =>
									navigate(`/projects/${project.id}`)
								}
							>
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between gap-2">
										<CardTitle className="text-base sm:text-lg line-clamp-1">
											{project.name}
										</CardTitle>
										<Badge
											className={getStatusColor(
												project.status
											)}
										>
											{project.status}
										</Badge>
									</div>
									<p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
										{project.client?.companyName ||
											"No client"}
									</p>
								</CardHeader>

								<CardContent className="space-y-3">
									<div className="flex flex-wrap gap-2">
										<Badge
											variant="outline"
											className={getPriorityColor(
												project.priority
											)}
										>
											{project.priority}
										</Badge>
										{isNearDeadline && (
											<Badge
												variant="destructive"
												className="animate-pulse"
											>
												{daysUntil} days left
											</Badge>
										)}
									</div>

									<div className="grid grid-cols-2 gap-2 text-sm">
										<div>
											<p className="text-xs text-muted-foreground">
												Deadline
											</p>
											<p
												className={`font-medium text-xs sm:text-sm ${
													isNearDeadline
														? "text-red-600"
														: ""
												}`}
											>
												{formatDate(project.deadline)}
											</p>
										</div>
										<div>
											<p className="text-xs text-muted-foreground">
												Budget
											</p>
											<p className="font-medium text-xs sm:text-sm">
												$
												{project.estimatedBudget?.toLocaleString() ||
													"0"}
											</p>
										</div>
									</div>

									{project.description && (
										<p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
											{project.description}
										</p>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
};
