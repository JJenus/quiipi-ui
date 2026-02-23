// src/pages/ClientDetails.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	useClient,
	useClients,
	useClientProjects,
	useClientInvoices,
	useClientSubscriptions,
} from "@/hooks/useClients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClientForm } from "@/components/clients/ClientForm";
import {
	ArrowLeft,
	Edit,
	Trash2,
	Mail,
	Phone,
	Globe,
	MapPin,
	Building2,
	FolderKanban,
	FileText,
	CreditCard,
	Plus,
	Calendar,
	DollarSign,
	AlertCircle,
	ExternalLink,
	Users,
	Receipt,
	Server,
	Activity,
} from "lucide-react";
import { formatAddress } from "@/utils/formatters";
import { formatCurrency, formatDate, getDaysUntil } from "@/utils/dateUtils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
	InvoiceStatus,
	ProjectStatus,
	SubscriptionType,
	ClientStatus,
} from "@/types";
import { ScrollableDialog } from "@/components/ui/scrollable-dialog";

export const ClientDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	const { client, isLoading: clientLoading } = useClient(id!);
	const { updateClient, deleteClient } = useClients();
	const { projects, isLoading: projectsLoading } = useClientProjects(id!);
	const { invoices, isLoading: invoicesLoading } = useClientInvoices(id!);
	const { subscriptions, isLoading: subscriptionsLoading } =
		useClientSubscriptions(id!);

	const handleUpdate = async (data: any) => {
		await updateClient({ id: id!, data });
		setShowEditDialog(false);
	};

	const handleDelete = async () => {
		await deleteClient(id!);
		setShowDeleteDialog(false);
		navigate("/clients");
	};

	const getStatusColor = (status: ClientStatus) => {
		const colors = {
			[ClientStatus.ACTIVE]:
				"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
			[ClientStatus.INACTIVE]:
				"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
			[ClientStatus.LEAD]:
				"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	const getProjectStatusColor = (status: ProjectStatus) => {
		const colors = {
			[ProjectStatus.PLANNING]: "bg-blue-100 text-blue-800",
			[ProjectStatus.IN_PROGRESS]: "bg-green-100 text-green-800",
			[ProjectStatus.ON_HOLD]: "bg-yellow-100 text-yellow-800",
			[ProjectStatus.COMPLETED]: "bg-gray-100 text-gray-800",
			[ProjectStatus.CANCELLED]: "bg-red-100 text-red-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	const getInvoiceStatusColor = (status: InvoiceStatus) => {
		const colors = {
			[InvoiceStatus.DRAFT]: "bg-gray-100 text-gray-800",
			[InvoiceStatus.SENT]: "bg-blue-100 text-blue-800",
			[InvoiceStatus.PAID]: "bg-green-100 text-green-800",
			[InvoiceStatus.PARTIALLY_PAID]: "bg-yellow-100 text-yellow-800",
			[InvoiceStatus.OVERDUE]: "bg-red-100 text-red-800",
			[InvoiceStatus.CANCELLED]: "bg-gray-100 text-gray-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	if (clientLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center space-x-4">
					<Skeleton className="h-10 w-10" />
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="grid gap-4 md:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className="h-32" />
					))}
				</div>
				<Skeleton className="h-96" />
			</div>
		);
	}

	if (!client) {
		return (
			<div className="text-center py-12">
				<Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h2 className="text-2xl font-bold">Client not found</h2>
				<p className="text-muted-foreground mt-2 mb-4">
					The client you're looking for doesn't exist or has been
					deleted.
				</p>
				<Button onClick={() => navigate("/clients")}>
					Back to Clients
				</Button>
			</div>
		);
	}

	const totalOutstanding =
		invoices?.reduce(
			(sum, inv) =>
				sum +
				(inv.status !== InvoiceStatus.PAID ? inv.pendingBalance : 0),
			0
		) || 0;

	const overdueInvoices =
		invoices?.filter((inv) => inv.status === InvoiceStatus.OVERDUE) || [];
	const activeProjects =
		projects?.filter(
			(p) =>
				p.status === ProjectStatus.IN_PROGRESS ||
				p.status === ProjectStatus.PLANNING
		) || [];
	const expiringSubscriptions =
		subscriptions?.filter((sub) => {
			const daysUntil = getDaysUntil(sub.expiryDate);
			return daysUntil <= 30 && daysUntil > 0;
		}) || [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/clients")}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl sm:text-3xl font-bold">
								{client.companyName}
							</h1>
							<Badge className={getStatusColor(client.status)}>
								{client.status}
							</Badge>
						</div>
						<p className="text-sm sm:text-base text-muted-foreground">
							{client.contactPerson} • {client.email}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => setShowEditDialog(true)}
					>
						<Edit className="mr-2 h-4 w-4" />
						Edit
					</Button>
					<Button
						variant="outline"
						className="text-red-600 hover:text-red-700 hover:bg-red-100"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 grid-cols-2 md:grid-cols-4">
				<Card className="bg-blue-50 dark:bg-blue-950/20">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<DollarSign className="h-4 w-4" />
							Outstanding
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xl sm:text-2xl font-bold text-blue-600">
							{formatCurrency(totalOutstanding, client.currency)}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Across{" "}
							{invoices?.filter(
								(i) => i.status !== InvoiceStatus.PAID
							).length || 0}{" "}
							invoices
						</p>
					</CardContent>
				</Card>

				<Card className="bg-red-50 dark:bg-red-950/20">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<AlertCircle className="h-4 w-4" />
							Overdue
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xl sm:text-2xl font-bold text-red-600">
							{overdueInvoices.length}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{formatCurrency(
								overdueInvoices.reduce(
									(sum, inv) => sum + inv.pendingBalance,
									0
								),
								client.currency
							)}
						</p>
					</CardContent>
				</Card>

				<Card className="bg-green-50 dark:bg-green-950/20">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<FolderKanban className="h-4 w-4" />
							Active Projects
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xl sm:text-2xl font-bold text-green-600">
							{activeProjects.length}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Total: {projects?.length || 0} projects
						</p>
					</CardContent>
				</Card>

				<Card className="bg-yellow-50 dark:bg-yellow-950/20">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Server className="h-4 w-4" />
							Expiring Soon
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xl sm:text-2xl font-bold text-yellow-600">
							{expiringSubscriptions.length}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Within 30 days
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Mobile Tabs */}
			{isMobile ? (
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="projects">
							Projects
							{projects && projects.length > 0 && (
								<Badge variant="secondary" className="ml-2">
									{projects.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value="invoices">
							Invoices
							{invoices && invoices.length > 0 && (
								<Badge variant="secondary" className="ml-2">
									{invoices.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value="subscriptions">
							Subs
							{subscriptions && subscriptions.length > 0 && (
								<Badge variant="secondary" className="ml-2">
									{subscriptions.length}
								</Badge>
							)}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4 mt-4">
						{/* Contact Info Card */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<Users className="h-4 w-4" />
									Contact Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center gap-3">
									<Mail className="h-4 w-4 text-muted-foreground shrink-0" />
									<a
										href={`mailto:${client.email}`}
										className="text-sm break-all hover:underline"
									>
										{client.email}
									</a>
								</div>
								<div className="flex items-center gap-3">
									<Phone className="h-4 w-4 text-muted-foreground shrink-0" />
									<a
										href={`tel:${client.phone}`}
										className="text-sm hover:underline"
									>
										{client.phone}
									</a>
								</div>
								{client.alternatePhone && (
									<div className="flex items-center gap-3">
										<Phone className="h-4 w-4 text-muted-foreground shrink-0" />
										<span className="text-sm">
											{client.alternatePhone}
										</span>
									</div>
								)}
								{client.website && (
									<div className="flex items-center gap-3">
										<Globe className="h-4 w-4 text-muted-foreground shrink-0" />
										<a
											href={client.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm break-all hover:underline"
										>
											{client.website}
										</a>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Address Card */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									Billing Address
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex gap-3">
									<MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
									<p className="text-sm whitespace-pre-line">
										{formatAddress(client.billingAddress)}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Additional Info Card */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">
									Additional Details
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Tax ID:
									</span>
									<span className="text-sm font-medium">
										{client.taxId || "N/A"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Payment Terms:
									</span>
									<span className="text-sm font-medium">
										{client.paymentTerms || "N/A"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Currency:
									</span>
									<span className="text-sm font-medium">
										{client.currency}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Credit Limit:
									</span>
									<span className="text-sm font-medium">
										{formatCurrency(
											client.creditLimit || 0,
											client.currency
										)}
									</span>
								</div>
								{client.notes && (
									<div className="pt-2 border-t">
										<p className="text-sm text-muted-foreground mb-1">
											Notes
										</p>
										<p className="text-sm whitespace-pre-wrap">
											{client.notes}
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<div className="grid grid-cols-2 gap-2">
							<Button
								variant="outline"
								className="w-full"
								onClick={() =>
									navigate("/projects/new", {
										state: { clientId: id },
									})
								}
							>
								<Plus className="mr-2 h-4 w-4" />
								New Project
							</Button>
							<Button
								variant="outline"
								className="w-full"
								onClick={() =>
									navigate("/invoices/new", {
										state: { clientId: id },
									})
								}
							>
								<Plus className="mr-2 h-4 w-4" />
								New Invoice
							</Button>
						</div>
					</TabsContent>

					<TabsContent value="projects" className="mt-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="text-lg">
									Projects
								</CardTitle>
								<Button
									size="sm"
									onClick={() =>
										navigate("/projects/new", {
											state: { clientId: id },
										})
									}
								>
									<Plus className="mr-2 h-4 w-4" />
									New
								</Button>
							</CardHeader>
							<CardContent>
								{projectsLoading ? (
									<div className="space-y-2">
										<Skeleton className="h-20 w-full" />
										<Skeleton className="h-20 w-full" />
									</div>
								) : projects?.length === 0 ? (
									<div className="text-center py-8">
										<FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
										<p className="text-muted-foreground">
											No projects yet
										</p>
										<Button
											variant="outline"
											size="sm"
											className="mt-4"
											onClick={() =>
												navigate("/projects/new", {
													state: { clientId: id },
												})
											}
										>
											Create your first project
										</Button>
									</div>
								) : (
									<div className="space-y-3">
										{projects?.map((project) => {
											const isNearDeadline =
												getDaysUntil(
													project.deadline
												) <= 7 &&
												getDaysUntil(project.deadline) >
													0;

											return (
												<div
													key={project.id}
													className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
													onClick={() =>
														navigate(
															`/projects/${project.id}`
														)
													}
												>
													<div className="flex items-start justify-between mb-2">
														<div>
															<p className="font-medium">
																{project.name}
															</p>
															<div className="flex items-center gap-2 mt-1">
																<Badge
																	className={getProjectStatusColor(
																		project.status
																	)}
																>
																	{
																		project.status
																	}
																</Badge>
																{isNearDeadline && (
																	<Badge
																		variant="destructive"
																		className="animate-pulse"
																	>
																		{getDaysUntil(
																			project.deadline
																		)}{" "}
																		days
																		left
																	</Badge>
																)}
															</div>
														</div>
														<Button
															variant="ghost"
															size="sm"
															className="shrink-0"
														>
															<ExternalLink className="h-4 w-4" />
														</Button>
													</div>
													<div className="grid grid-cols-2 gap-2 text-sm mt-3">
														<div>
															<p className="text-xs text-muted-foreground">
																Budget
															</p>
															<p className="font-medium">
																{formatCurrency(
																	project.estimatedBudget ||
																		0
																)}
															</p>
														</div>
														<div>
															<p className="text-xs text-muted-foreground">
																Deadline
															</p>
															<p
																className={`font-medium ${isNearDeadline ? "text-red-600" : ""}`}
															>
																{formatDate(
																	project.deadline,
																	"MMM d, yyyy"
																)}
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="invoices" className="mt-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="text-lg">
									Invoices
								</CardTitle>
								<Button
									size="sm"
									onClick={() =>
										navigate("/invoices/new", {
											state: { clientId: id },
										})
									}
								>
									<Plus className="mr-2 h-4 w-4" />
									New
								</Button>
							</CardHeader>
							<CardContent>
								{invoicesLoading ? (
									<div className="space-y-2">
										<Skeleton className="h-20 w-full" />
										<Skeleton className="h-20 w-full" />
									</div>
								) : invoices?.length === 0 ? (
									<div className="text-center py-8">
										<Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
										<p className="text-muted-foreground">
											No invoices yet
										</p>
										<Button
											variant="outline"
											size="sm"
											className="mt-4"
											onClick={() =>
												navigate("/invoices/new", {
													state: { clientId: id },
												})
											}
										>
											Create your first invoice
										</Button>
									</div>
								) : (
									<div className="space-y-3">
										{invoices?.map((invoice) => (
											<div
												key={invoice.id}
												className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
												onClick={() =>
													navigate(
														`/invoices/${invoice.id}`
													)
												}
											>
												<div className="flex items-start justify-between mb-2">
													<div>
														<p className="font-medium">
															{
																invoice.invoiceNumber
															}
														</p>
														<Badge
															className={getInvoiceStatusColor(
																invoice.status
															)}
														>
															{invoice.status}
														</Badge>
													</div>
													<p className="font-bold">
														{formatCurrency(
															invoice.totalAmount
														)}
													</p>
												</div>
												<div className="grid grid-cols-2 gap-2 text-sm mt-3">
													<div>
														<p className="text-xs text-muted-foreground">
															Due Date
														</p>
														<p
															className={
																invoice.status ===
																InvoiceStatus.OVERDUE
																	? "text-red-600 font-medium"
																	: ""
															}
														>
															{formatDate(
																invoice.dueDate,
																"MMM d, yyyy"
															)}
														</p>
													</div>
													<div>
														<p className="text-xs text-muted-foreground">
															Pending
														</p>
														<p className="text-orange-600 font-medium">
															{formatCurrency(
																invoice.pendingBalance
															)}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="subscriptions" className="mt-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="text-lg">
									Subscriptions
								</CardTitle>
								<Button
									size="sm"
									onClick={() =>
										navigate("/subscriptions/new", {
											state: { clientId: id },
										})
									}
								>
									<Plus className="mr-2 h-4 w-4" />
									Add
								</Button>
							</CardHeader>
							<CardContent>
								{subscriptionsLoading ? (
									<div className="space-y-2">
										<Skeleton className="h-20 w-full" />
										<Skeleton className="h-20 w-full" />
									</div>
								) : subscriptions?.length === 0 ? (
									<div className="text-center py-8">
										<Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
										<p className="text-muted-foreground">
											No subscriptions yet
										</p>
										<Button
											variant="outline"
											size="sm"
											className="mt-4"
											onClick={() =>
												navigate("/subscriptions/new", {
													state: { clientId: id },
												})
											}
										>
											Add your first subscription
										</Button>
									</div>
								) : (
									<div className="space-y-3">
										{subscriptions?.map((sub) => {
											const daysUntil = getDaysUntil(
												sub.expiryDate
											);
											const isExpiring =
												daysUntil <= 30 &&
												daysUntil > 0;

											return (
												<div
													key={sub.id}
													className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
													onClick={() =>
														navigate(
															`/subscriptions/${sub.id}`
														)
													}
												>
													<div className="flex items-start justify-between mb-2">
														<div>
															<p className="font-medium">
																{sub.name}
															</p>
															<p className="text-sm text-muted-foreground">
																{sub.provider}
															</p>
														</div>
														<p className="font-bold">
															{formatCurrency(
																sub.cost,
																sub.currency
															)}
														</p>
													</div>
													<div className="grid grid-cols-2 gap-2 text-sm mt-3">
														<div>
															<p className="text-xs text-muted-foreground">
																Type
															</p>
															<Badge variant="outline">
																{sub.type}
															</Badge>
														</div>
														<div>
															<p className="text-xs text-muted-foreground">
																Expiry
															</p>
															<p
																className={
																	isExpiring
																		? "text-orange-600 font-medium"
																		: ""
																}
															>
																{formatDate(
																	sub.expiryDate,
																	"MMM d, yyyy"
																)}
																{isExpiring &&
																	` (${daysUntil}d)`}
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			) : (
				/* Desktop Layout */
				<>
					{/* Desktop Info Cards */}
					<div className="grid gap-6 md:grid-cols-3">
						{/* Contact Info Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Users className="h-5 w-5" />
									Contact Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-3">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<a
										href={`mailto:${client.email}`}
										className="text-sm hover:underline"
									>
										{client.email}
									</a>
								</div>
								<div className="flex items-center gap-3">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<a
										href={`tel:${client.phone}`}
										className="text-sm hover:underline"
									>
										{client.phone}
									</a>
								</div>
								{client.alternatePhone && (
									<div className="flex items-center gap-3">
										<Phone className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">
											{client.alternatePhone}
										</span>
									</div>
								)}
								{client.website && (
									<div className="flex items-center gap-3">
										<Globe className="h-4 w-4 text-muted-foreground" />
										<a
											href={client.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm hover:underline break-all"
										>
											{client.website}
										</a>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Billing Address Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MapPin className="h-5 w-5" />
									Billing Address
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex gap-3">
									<MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
									<p className="text-sm whitespace-pre-line">
										{formatAddress(client.billingAddress)}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Additional Info Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Activity className="h-5 w-5" />
									Additional Details
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Tax ID:
									</span>
									<span className="text-sm font-medium">
										{client.taxId || "N/A"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Payment Terms:
									</span>
									<span className="text-sm font-medium">
										{client.paymentTerms || "N/A"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Currency:
									</span>
									<span className="text-sm font-medium">
										{client.currency}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">
										Credit Limit:
									</span>
									<span className="text-sm font-medium">
										{formatCurrency(
											client.creditLimit || 0,
											client.currency
										)}
									</span>
								</div>
								{client.notes && (
									<div className="pt-3 border-t">
										<p className="text-sm text-muted-foreground mb-1">
											Notes
										</p>
										<p className="text-sm whitespace-pre-wrap">
											{client.notes}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Desktop Tabs */}
					<Tabs defaultValue="projects" className="space-y-4">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="projects">
								Projects
								{projects && projects.length > 0 && (
									<Badge variant="secondary" className="ml-2">
										{projects.length}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger value="invoices">
								Invoices
								{invoices && invoices.length > 0 && (
									<Badge variant="secondary" className="ml-2">
										{invoices.length}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger value="subscriptions">
								Subscriptions
								{subscriptions && subscriptions.length > 0 && (
									<Badge variant="secondary" className="ml-2">
										{subscriptions.length}
									</Badge>
								)}
							</TabsTrigger>
						</TabsList>

						<TabsContent value="projects">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle>All Projects</CardTitle>
									<Button
										size="sm"
										onClick={() =>
											navigate("/projects/new", {
												state: { clientId: id },
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										New Project
									</Button>
								</CardHeader>
								<CardContent>
									{projectsLoading ? (
										<div className="space-y-2">
											<Skeleton className="h-16 w-full" />
											<Skeleton className="h-16 w-full" />
										</div>
									) : projects?.length === 0 ? (
										<div className="text-center py-8">
											<FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
											<p className="text-muted-foreground">
												No projects yet
											</p>
										</div>
									) : (
										<div className="divide-y">
											{projects?.map((project) => {
												const isNearDeadline =
													getDaysUntil(
														project.deadline
													) <= 7 &&
													getDaysUntil(
														project.deadline
													) > 0;

												return (
													<div
														key={project.id}
														className="flex items-center justify-between py-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-muted/50 -mx-4 px-4 transition-colors"
														onClick={() =>
															navigate(
																`/projects/${project.id}`
															)
														}
													>
														<div className="flex-1">
															<div className="flex items-center gap-2">
																<p className="font-medium">
																	{
																		project.name
																	}
																</p>
																<Badge
																	className={getProjectStatusColor(
																		project.status
																	)}
																>
																	{
																		project.status
																	}
																</Badge>
																{isNearDeadline && (
																	<Badge
																		variant="destructive"
																		className="animate-pulse"
																	>
																		{getDaysUntil(
																			project.deadline
																		)}{" "}
																		days
																		left
																	</Badge>
																)}
															</div>
															<p className="text-sm text-muted-foreground mt-1">
																Deadline:{" "}
																{formatDate(
																	project.deadline,
																	"MMM d, yyyy"
																)}
															</p>
														</div>
														<div className="text-right">
															<p className="font-bold">
																{formatCurrency(
																	project.estimatedBudget ||
																		0
																)}
															</p>
															<p className="text-xs text-muted-foreground">
																Budget
															</p>
														</div>
													</div>
												);
											})}
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="invoices">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle>All Invoices</CardTitle>
									<Button
										size="sm"
										onClick={() =>
											navigate("/invoices/new", {
												state: { clientId: id },
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										New Invoice
									</Button>
								</CardHeader>
								<CardContent>
									{invoicesLoading ? (
										<div className="space-y-2">
											<Skeleton className="h-16 w-full" />
											<Skeleton className="h-16 w-full" />
										</div>
									) : invoices?.length === 0 ? (
										<div className="text-center py-8">
											<Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
											<p className="text-muted-foreground">
												No invoices yet
											</p>
										</div>
									) : (
										<div className="divide-y">
											{invoices?.map((invoice) => (
												<div
													key={invoice.id}
													className="flex items-center justify-between py-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-muted/50 -mx-4 px-4 transition-colors"
													onClick={() =>
														navigate(
															`/invoices/${invoice.id}`
														)
													}
												>
													<div className="flex-1">
														<div className="flex items-center gap-2">
															<p className="font-medium">
																{
																	invoice.invoiceNumber
																}
															</p>
															<Badge
																className={getInvoiceStatusColor(
																	invoice.status
																)}
															>
																{invoice.status}
															</Badge>
														</div>
														<p className="text-sm text-muted-foreground mt-1">
															Due:{" "}
															{formatDate(
																invoice.dueDate,
																"MMM d, yyyy"
															)}
														</p>
													</div>
													<div className="text-right">
														<p className="font-bold">
															{formatCurrency(
																invoice.totalAmount
															)}
														</p>
														{invoice.pendingBalance >
															0 && (
															<p className="text-xs text-orange-600">
																Pending:{" "}
																{formatCurrency(
																	invoice.pendingBalance
																)}
															</p>
														)}
													</div>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="subscriptions">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle>All Subscriptions</CardTitle>
									<Button
										size="sm"
										onClick={() =>
											navigate("/subscriptions/new", {
												state: { clientId: id },
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Subscription
									</Button>
								</CardHeader>
								<CardContent>
									{subscriptionsLoading ? (
										<div className="space-y-2">
											<Skeleton className="h-16 w-full" />
											<Skeleton className="h-16 w-full" />
										</div>
									) : subscriptions?.length === 0 ? (
										<div className="text-center py-8">
											<Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
											<p className="text-muted-foreground">
												No subscriptions yet
											</p>
										</div>
									) : (
										<div className="divide-y">
											{subscriptions?.map((sub) => {
												const daysUntil = getDaysUntil(
													sub.expiryDate
												);
												const isExpiring =
													daysUntil <= 30 &&
													daysUntil > 0;

												return (
													<div
														key={sub.id}
														className="flex items-center justify-between py-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-muted/50 -mx-4 px-4 transition-colors"
														onClick={() =>
															navigate(
																`/subscriptions/${sub.id}`
															)
														}
													>
														<div className="flex-1">
															<div className="flex items-center gap-2">
																<p className="font-medium">
																	{sub.name}
																</p>
																<Badge variant="outline">
																	{sub.type}
																</Badge>
																{isExpiring && (
																	<Badge
																		variant="destructive"
																		className="animate-pulse"
																	>
																		{
																			daysUntil
																		}{" "}
																		days
																		left
																	</Badge>
																)}
															</div>
															<p className="text-sm text-muted-foreground mt-1">
																{sub.provider} •
																Expires:{" "}
																{formatDate(
																	sub.expiryDate,
																	"MMM d, yyyy"
																)}
															</p>
														</div>
														<div className="text-right">
															<p className="font-bold">
																{formatCurrency(
																	sub.cost,
																	sub.currency
																)}
															</p>
															<p className="text-xs text-muted-foreground">
																/{" "}
																{sub.billingCycle.toLowerCase()}
															</p>
														</div>
													</div>
												);
											})}
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</>
			)}

			{/* Then the ScrollableDialog separately */}
			<ScrollableDialog
				open={showEditDialog}
				onOpenChange={setShowEditDialog}
				title="Edit Client"
				description="Update client details"
				className="sm:max-w-[900px]"
			>
				<ClientForm
					initialData={client}
					onSubmit={handleUpdate}
					onCancel={() => setShowEditDialog(false)}
				/>
			</ScrollableDialog>

			{/* Delete Confirmation */}
			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Client</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "
							{client.companyName}"? This action cannot be undone.
							This will also delete all associated projects,
							invoices, and subscriptions.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
