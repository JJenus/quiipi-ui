// src/pages/Invoices.tsx
import React, { useState } from "react";
import { useInvoices, useOverdueInvoices } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
	Plus,
	Search,
	FileText,
	AlertCircle,
	Filter,
	Download,
	MoreVertical,
	Mail,
	DollarSign,
	Calendar,
	Clock,
} from "lucide-react";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import {
	formatDate,
	formatCurrency,
	getDueDateStatus,
} from "@/utils/dateUtils";
import { InvoiceStatus } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ScrollableDialog } from "@/components/ui/scrollable-dialog";

export const Invoices: React.FC = () => {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [mobileView, setMobileView] = useState<"list" | "grid">("list");
	const { invoices, isLoading, createInvoice, sendInvoice, deleteInvoice } =
		useInvoices();
	const { invoices: overdueInvoices } = useOverdueInvoices();
	const navigate = useNavigate();
	const isMobile = useMediaQuery("(max-width: 768px)");

	const getStatusBadge = (status: InvoiceStatus) => {
		const variants: Record<InvoiceStatus, string> = {
			[InvoiceStatus.DRAFT]:
				"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
			[InvoiceStatus.SENT]:
				"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
			[InvoiceStatus.PAID]:
				"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
			[InvoiceStatus.PARTIALLY_PAID]:
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
			[InvoiceStatus.OVERDUE]:
				"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
			[InvoiceStatus.CANCELLED]:
				"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
		};
		return (
			<Badge className={variants[status]} variant="outline">
				{status.replace("_", " ")}
			</Badge>
		);
	};

	const getStatusIcon = (status: InvoiceStatus) => {
		switch (status) {
			case InvoiceStatus.PAID:
				return <div className="h-2 w-2 rounded-full bg-green-500" />;
			case InvoiceStatus.OVERDUE:
				return <div className="h-2 w-2 rounded-full bg-red-500" />;
			case InvoiceStatus.PARTIALLY_PAID:
				return <div className="h-2 w-2 rounded-full bg-yellow-500" />;
			case InvoiceStatus.SENT:
				return <div className="h-2 w-2 rounded-full bg-blue-500" />;
			default:
				return <div className="h-2 w-2 rounded-full bg-gray-500" />;
		}
	};

	const filteredInvoices = invoices.filter((invoice) => {
		const matchesSearch =
			invoice.invoiceNumber
				.toLowerCase()
				.includes(search.toLowerCase()) ||
			invoice.clientName.toLowerCase().includes(search.toLowerCase()) ||
			invoice.projectName?.toLowerCase().includes(search.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || invoice.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const stats = {
		total: invoices.length,
		paid: invoices.filter((i) => i.status === InvoiceStatus.PAID).length,
		pending: invoices.filter(
			(i) =>
				i.status === InvoiceStatus.SENT ||
				i.status === InvoiceStatus.PARTIALLY_PAID
		).length,
		overdue: overdueInvoices.length,
		totalAmount: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
		pendingAmount: invoices
			.filter(
				(i) =>
					i.status === InvoiceStatus.SENT ||
					i.status === InvoiceStatus.PARTIALLY_PAID ||
					i.status === InvoiceStatus.OVERDUE
			)
			.reduce((sum, i) => sum + i.pendingBalance, 0),
	};

	const statusOptions = [
		{ value: "all", label: "All Status" },
		{ value: InvoiceStatus.DRAFT, label: "Draft" },
		{ value: InvoiceStatus.SENT, label: "Sent" },
		{ value: InvoiceStatus.PAID, label: "Paid" },
		{ value: InvoiceStatus.PARTIALLY_PAID, label: "Partially Paid" },
		{ value: InvoiceStatus.OVERDUE, label: "Overdue" },
		{ value: InvoiceStatus.CANCELLED, label: "Cancelled" },
	];

	console.log(invoices);

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold">Invoices</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Manage and track all your invoices and payments.
					</p>
				</div>

				{/* Button triggers the dialog */}
				<Button
					className="w-full sm:w-auto"
					onClick={() => setIsCreateDialogOpen(true)}
				>
					<Plus className="mr-2 h-4 w-4" />
					Create Invoice
				</Button>
			</div>

			{/* Then the ScrollableDialog separately */}
			<ScrollableDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				title="Create New Invoice"
				description="Fill in the details to create a new invoice"
				className="sm:max-w-[900px]"
			>
				<InvoiceForm
					onSubmit={async (data) => {
						await createInvoice(data);
						setIsCreateDialogOpen(false);
					}}
					onCancel={() => setIsCreateDialogOpen(false)}
				/>
			</ScrollableDialog>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
				<Card className="bg-blue-50 dark:bg-blue-950/20">
					<CardContent className="p-3 sm:p-4">
						<p className="text-xs sm:text-sm text-muted-foreground">
							Total
						</p>
						<p className="text-lg sm:text-2xl font-bold">
							{stats.total}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{formatCurrency(stats.totalAmount)}
						</p>
					</CardContent>
				</Card>
				<Card className="bg-green-50 dark:bg-green-950/20">
					<CardContent className="p-3 sm:p-4">
						<p className="text-xs sm:text-sm text-muted-foreground">
							Paid
						</p>
						<p className="text-lg sm:text-2xl font-bold text-green-600">
							{stats.paid}
						</p>
					</CardContent>
				</Card>
				<Card className="bg-yellow-50 dark:bg-yellow-950/20">
					<CardContent className="p-3 sm:p-4">
						<p className="text-xs sm:text-sm text-muted-foreground">
							Pending
						</p>
						<p className="text-lg sm:text-2xl font-bold text-yellow-600">
							{stats.pending}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{formatCurrency(stats.pendingAmount)}
						</p>
					</CardContent>
				</Card>
				<Card className="bg-red-50 dark:bg-red-950/20">
					<CardContent className="p-3 sm:p-4">
						<p className="text-xs sm:text-sm text-muted-foreground">
							Overdue
						</p>
						<p className="text-lg sm:text-2xl font-bold text-red-600">
							{stats.overdue}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Overdue Alert */}
			{overdueInvoices.length > 0 && (
				<Alert
					variant="destructive"
					className="border-red-200 dark:border-red-900"
				>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Overdue Invoices</AlertTitle>
					<AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
						<span>
							You have {overdueInvoices.length} overdue invoice
							{overdueInvoices.length > 1
								? "s"
								: ""} totaling{" "}
							{formatCurrency(
								overdueInvoices.reduce(
									(sum, inv) => sum + inv.pendingBalance,
									0
								),
								"USD"
							)}
						</span>
						<Button
							variant="outline"
							size="sm"
							className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto"
							onClick={() =>
								setStatusFilter(InvoiceStatus.OVERDUE)
							}
						>
							View Overdue
						</Button>
					</AlertDescription>
				</Alert>
			)}

			{/* Main Content */}
			<Card>
				<CardHeader className="space-y-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<CardTitle>All Invoices</CardTitle>

						{/* Mobile View Toggle */}
						{isMobile && (
							<div className="flex items-center gap-2">
								<Button
									variant={
										mobileView === "list"
											? "default"
											: "outline"
									}
									size="sm"
									onClick={() => setMobileView("list")}
									className="h-8"
								>
									List
								</Button>
								<Button
									variant={
										mobileView === "grid"
											? "default"
											: "outline"
									}
									size="sm"
									onClick={() => setMobileView("grid")}
									className="h-8"
								>
									Grid
								</Button>
							</div>
						)}
					</div>

					{/* Search and Filters */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={
									isMobile
										? "Search..."
										: "Search by invoice #, client..."
								}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9 pr-4 w-full"
							/>
						</div>

						{!isMobile && (
							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}
							>
								<SelectTrigger className="w-[180px]">
									<Filter className="h-4 w-4 mr-2" />
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									{statusOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>

					{/* Mobile Status Filter Tabs */}
					{isMobile && (
						<div className="overflow-x-auto pb-2 -mx-1 px-1">
							<div className="flex gap-1 min-w-max">
								{statusOptions.map((option) => (
									<Button
										key={option.value}
										variant={
											statusFilter === option.value
												? "default"
												: "outline"
										}
										size="sm"
										onClick={() =>
											setStatusFilter(option.value)
										}
										className="whitespace-nowrap"
									>
										{option.label}
									</Button>
								))}
							</div>
						</div>
					)}
				</CardHeader>

				<CardContent>
					{/* Loading State */}
					{isLoading && (
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					)}

					{/* Empty State */}
					{!isLoading && filteredInvoices.length === 0 && (
						<div className="text-center py-12">
							<FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								No invoices found
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								{search || statusFilter !== "all"
									? "Try adjusting your search or filters"
									: "Get started by creating your first invoice"}
							</p>
							{search || statusFilter !== "all" ? (
								<Button
									variant="outline"
									onClick={() => {
										setSearch("");
										setStatusFilter("all");
									}}
								>
									Clear Filters
								</Button>
							) : (
								<Button
									onClick={() => setIsCreateDialogOpen(true)}
								>
									<Plus className="mr-2 h-4 w-4" />
									Create Invoice
								</Button>
							)}
						</div>
					)}

					{/* Desktop Table View */}
					{!isLoading && filteredInvoices.length > 0 && !isMobile && (
						<div className="border rounded-lg overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Invoice #</TableHead>
										<TableHead>Client</TableHead>
										<TableHead>Issue Date</TableHead>
										<TableHead>Due Date</TableHead>
										<TableHead>Total</TableHead>
										<TableHead>Pending</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredInvoices.map((invoice) => (
										<TableRow
											key={invoice.id}
											className="cursor-pointer hover:bg-muted/50"
											onClick={() =>
												navigate(
													`/invoices/${invoice.id}`
												)
											}
										>
											<TableCell className="font-medium">
												<div className="flex items-center gap-2">
													{getStatusIcon(
														invoice.status
													)}
													{invoice.invoiceNumber}
												</div>
											</TableCell>
											<TableCell>
												{invoice.clientName}
											</TableCell>
											<TableCell>
												{formatDate(
													invoice.issueDate,
													"MMM d, yyyy"
												)}
											</TableCell>
											<TableCell>
												<span
													className={
														invoice.isOverdue
															? "text-red-600 font-medium"
															: ""
													}
												>
													{formatDate(
														invoice.dueDate,
														"MMM d, yyyy"
													)}
													{invoice.isOverdue && (
														<span className="block text-xs text-red-600">
															{
																invoice.daysOverdue
															}{" "}
															days overdue
														</span>
													)}
												</span>
											</TableCell>
											<TableCell className="font-medium">
												{formatCurrency(
													invoice.totalAmount
												)}
											</TableCell>
											<TableCell>
												{invoice.pendingBalance > 0 ? (
													<span className="font-medium text-orange-600">
														{formatCurrency(
															invoice.pendingBalance
														)}
													</span>
												) : (
													<span className="text-muted-foreground">
														-
													</span>
												)}
											</TableCell>
											<TableCell>
												{getStatusBadge(invoice.status)}
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														<Button
															variant="ghost"
															className="h-8 w-8 p-0"
														>
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>
															Actions
														</DropdownMenuLabel>
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																navigate(
																	`/invoices/${invoice.id}`
																);
															}}
														>
															<FileText className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																// Handle download
															}}
														>
															<Download className="mr-2 h-4 w-4" />
															Download PDF
														</DropdownMenuItem>
														{invoice.status ===
															InvoiceStatus.DRAFT && (
															<DropdownMenuItem
																onClick={(
																	e
																) => {
																	e.stopPropagation();
																	sendInvoice(
																		invoice.id
																	);
																}}
															>
																<Mail className="mr-2 h-4 w-4" />
																Send Invoice
															</DropdownMenuItem>
														)}
														{invoice.status !==
															InvoiceStatus.PAID &&
															invoice.status !==
																InvoiceStatus.CANCELLED && (
																<DropdownMenuItem
																	onClick={(
																		e
																	) => {
																		e.stopPropagation();
																		// Handle payment
																	}}
																>
																	<DollarSign className="mr-2 h-4 w-4" />
																	Record
																	Payment
																</DropdownMenuItem>
															)}
														<DropdownMenuSeparator />
														<DropdownMenuItem
															className="text-red-600"
															onClick={(e) => {
																e.stopPropagation();
																if (
																	window.confirm(
																		"Are you sure you want to delete this invoice?"
																	)
																) {
																	deleteInvoice(
																		invoice.id
																	);
																}
															}}
														>
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}

					{/* Mobile Grid View */}
					{!isLoading &&
						filteredInvoices.length > 0 &&
						isMobile &&
						mobileView === "grid" && (
							<div className="grid grid-cols-1 gap-4">
								{filteredInvoices.map((invoice) => (
									<Card
										key={invoice.id}
										className="cursor-pointer hover:shadow-lg transition-all"
										onClick={() =>
											navigate(`/invoices/${invoice.id}`)
										}
									>
										<CardHeader className="pb-2">
											<div className="flex items-start justify-between">
												<div className="flex items-center gap-2">
													{getStatusIcon(
														invoice.status
													)}
													<CardTitle className="text-base">
														{invoice.invoiceNumber}
													</CardTitle>
												</div>
												{getStatusBadge(invoice.status)}
											</div>
											<CardDescription>
												{invoice.clientName}
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="grid grid-cols-2 gap-2 text-sm">
												<div>
													<p className="text-muted-foreground">
														Issue Date
													</p>
													<p className="font-medium">
														{formatDate(
															invoice.issueDate,
															"MMM d, yyyy"
														)}
													</p>
												</div>
												<div>
													<p className="text-muted-foreground">
														Due Date
													</p>
													<p
														className={cn(
															"font-medium",
															invoice.isOverdue &&
																"text-red-600"
														)}
													>
														{formatDate(
															invoice.dueDate,
															"MMM d, yyyy"
														)}
													</p>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-4 pt-2 border-t">
												<div>
													<p className="text-xs text-muted-foreground">
														Total
													</p>
													<p className="font-semibold text-base">
														{formatCurrency(
															invoice.totalAmount
														)}
													</p>
												</div>
												<div>
													<p className="text-xs text-muted-foreground">
														Pending
													</p>
													<p className="font-semibold text-base text-orange-600">
														{formatCurrency(
															invoice.pendingBalance
														)}
													</p>
												</div>
											</div>

											{invoice.projectName && (
												<div className="text-xs text-muted-foreground">
													Project:{" "}
													{invoice.projectName}
												</div>
											)}

											<div className="flex justify-end gap-2 pt-2 border-t">
												<Button
													variant="outline"
													size="sm"
													onClick={(e) => {
														e.stopPropagation();
														navigate(
															`/invoices/${invoice.id}`
														);
													}}
													className="flex-1"
												>
													<FileText className="h-4 w-4 mr-2" />
													View
												</Button>
												{invoice.status ===
													InvoiceStatus.DRAFT && (
													<Button
														variant="outline"
														size="sm"
														onClick={(e) => {
															e.stopPropagation();
															sendInvoice(
																invoice.id
															);
														}}
														className="flex-1"
													>
														<Mail className="h-4 w-4 mr-2" />
														Send
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}

					{/* Mobile List View */}
					{!isLoading &&
						filteredInvoices.length > 0 &&
						isMobile &&
						mobileView === "list" && (
							<div className="space-y-2">
								{filteredInvoices.map((invoice) => (
									<div
										key={invoice.id}
										className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
										onClick={() =>
											navigate(`/invoices/${invoice.id}`)
										}
									>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												{getStatusIcon(invoice.status)}
												<p className="font-medium text-sm truncate">
													{invoice.invoiceNumber}
												</p>
											</div>
											<p className="text-xs text-muted-foreground truncate">
												{invoice.clientName}
											</p>
											<div className="flex items-center gap-2 mt-1 text-xs">
												<Calendar className="h-3 w-3" />
												<span>
													{formatDate(
														invoice.dueDate,
														"MMM d"
													)}
												</span>
												<Clock className="h-3 w-3 ml-1" />
												<span
													className={
														invoice.isOverdue
															? "text-red-600"
															: ""
													}
												>
													{invoice.isOverdue
														? "Overdue"
														: formatCurrency(
																invoice.pendingBalance
															)}
												</span>
											</div>
										</div>
										<Badge
											className={cn(
												invoice.status ===
													InvoiceStatus.PAID
													? "bg-green-100 text-green-800"
													: invoice.status ===
														  InvoiceStatus.OVERDUE
														? "bg-red-100 text-red-800"
														: "bg-gray-100 text-gray-800"
											)}
										>
											{invoice.status ===
											InvoiceStatus.PAID
												? "Paid"
												: invoice.status ===
													  InvoiceStatus.OVERDUE
													? "Overdue"
													: invoice.pendingBalance > 0
														? formatCurrency(
																invoice.pendingBalance
															)
														: "-"}
										</Badge>
									</div>
								))}
							</div>
						)}
				</CardContent>
			</Card>
		</div>
	);
};
