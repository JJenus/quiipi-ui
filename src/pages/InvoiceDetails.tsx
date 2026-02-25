// src/pages/InvoiceDetails.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoice, useInvoices } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/responsive-dialog";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ArrowLeft,
	Edit,
	Trash2,
	Download,
	Mail,
	Printer,
	DollarSign,
	CheckCircle,
	Clock,
	AlertCircle,
	FileText,
	User,
	Calendar,
	CreditCard,
	Receipt,
	Building2,
	MapPin,
	Phone,
	Mail as MailIcon,
	Globe,
	PlusCircle,
	History,
} from "lucide-react";
import { formatDate, formatCurrency, formatDateTimeForAPI } from "@/utils/dateUtils";
import { PaymentForm } from "@/components/invoices/PaymentForm";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { InvoiceItem, InvoiceStatus, Payment, PaymentMethod } from "@/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollableDialog } from "@/components/ui/scrollable-dialog";

export const InvoiceDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { invoice, isLoading } = useInvoice(id!);
	const { updateInvoice, deleteInvoice, addPayment, sendInvoice } =
		useInvoices();
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showPaymentForm, setShowPaymentForm] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [activeTab, setActiveTab] = useState("details");
	const isMobile = useMediaQuery("(max-width: 768px)");

	const getStatusColor = (status: InvoiceStatus) => {
		const colors = {
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
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	const getStatusIcon = (status: InvoiceStatus) => {
		switch (status) {
			case InvoiceStatus.PAID:
				return <CheckCircle className="h-5 w-5 text-green-600" />;
			case InvoiceStatus.OVERDUE:
				return <AlertCircle className="h-5 w-5 text-red-600" />;
			case InvoiceStatus.PARTIALLY_PAID:
				return <Clock className="h-5 w-5 text-yellow-600" />;
			case InvoiceStatus.SENT:
				return <Mail className="h-5 w-5 text-blue-600" />;
			default:
				return <FileText className="h-5 w-5 text-gray-600" />;
		}
	};

	const handleUpdate = async (data: any) => {
		await updateInvoice({ id: id!, data });
		setShowEditDialog(false);
	};

	const handleDelete = async () => {
		await deleteInvoice(id!);
		setShowDeleteDialog(false);
		navigate("/invoices");
	};

	const handleAddPayment = async (paymentData: any) => {
		await addPayment({ id: id!, data: paymentData });
		setShowPaymentForm(false);
	};

	const handleSendInvoice = async () => {
		setIsSending(true);
		try {
			await sendInvoice(id!);
		} finally {
			setIsSending(false);
		}
	};

	const handleMarkAsPaid = async () => {
		const paymentData = {
		  invoiceId: id!,
			amount: invoice?.pendingBalance,
			paymentDate: formatDateTimeForAPI(new Date().toISOString()),
			paymentMethod: PaymentMethod.BANK_TRANSFER,
			notes: "Marked as paid manually",
		};
		await addPayment({ id: id!, data: paymentData });
	};

	const handleDownloadPDF = () => {
		window.print();
	};

	if (isLoading) {
		return (
			<div className="space-y-4 sm:space-y-6">
				<div className="flex items-center space-x-4">
					<Skeleton className="h-10 w-10" />
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className="h-24" />
					))}
				</div>
				<Skeleton className="h-96" />
			</div>
		);
	}

	if (!invoice) {
		return (
			<div className="text-center py-12">
				<Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h2 className="text-2xl font-bold">Invoice not found</h2>
				<p className="text-muted-foreground mt-2 mb-4">
					The invoice you're looking for doesn't exist or has been
					deleted.
				</p>
				<Button onClick={() => navigate("/invoices")}>
					Back to Invoices
				</Button>
			</div>
		);
	}

	const canAddPayment =
		invoice.status !== InvoiceStatus.PAID &&
		invoice.status !== InvoiceStatus.CANCELLED &&
		invoice.pendingBalance > 0;

	return (
		<div className="space-y-4 sm:space-y-6 print:space-y-4">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/invoices")}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
							Invoice {invoice.invoiceNumber}
							{getStatusIcon(invoice.status)}
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground">
							Created on{" "}
							{formatDate(invoice.issueDate, "MMMM d, yyyy")}
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

			{/* Status Badge */}
			<div className="flex flex-wrap gap-2 print:hidden">
				<Badge className={getStatusColor(invoice.status)}>
					{invoice.status.replace("_", " ")}
				</Badge>
				{invoice.isOverdue && (
					<Badge variant="destructive" className="animate-pulse">
						Overdue by {invoice.daysOverdue} days
					</Badge>
				)}
			</div>

			{/* Overdue Alert */}
			{invoice.isOverdue && (
				<Alert variant="destructive" className="print:hidden">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Invoice Overdue</AlertTitle>
					<AlertDescription>
						This invoice is {invoice.daysOverdue} days overdue. The
						pending balance of{" "}
						{formatCurrency(invoice.pendingBalance)} requires
						immediate attention.
					</AlertDescription>
				</Alert>
			)}

			{/* Quick Action Buttons */}
			<div className="flex flex-wrap gap-2 print:hidden">
				<Button variant="outline" size="sm" onClick={handleDownloadPDF}>
					<Printer className="mr-2 h-4 w-4" />
					Print/PDF
				</Button>

				{invoice.status === InvoiceStatus.DRAFT && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleSendInvoice}
						disabled={isSending}
					>
						<Mail className="mr-2 h-4 w-4" />
						{isSending ? "Sending..." : "Send Invoice"}
					</Button>
				)}

				{canAddPayment && (
					<>
						<Button
							size="sm"
							onClick={() => setShowPaymentForm(true)}
						>
							<DollarSign className="mr-2 h-4 w-4" />
							Record Payment
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleMarkAsPaid}
						>
							<CheckCircle className="mr-2 h-4 w-4" />
							Mark as Paid
						</Button>
					</>
				)}
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 grid-cols-2 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							Issue Date
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg font-bold">
							{formatDate(invoice.issueDate, "MMM d")}
						</p>
						<p className="text-xs text-muted-foreground">
							{formatDate(invoice.issueDate, "yyyy")}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Clock className="h-4 w-4" />
							Due Date
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p
							className={`text-lg font-bold ${invoice.isOverdue ? "text-red-600" : ""}`}
						>
							{formatDate(invoice.dueDate, "MMM d")}
						</p>
						<p className="text-xs text-muted-foreground">
							{invoice.isOverdue
								? `${invoice.daysOverdue} days overdue`
								: formatDate(invoice.dueDate, "yyyy")}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<DollarSign className="h-4 w-4" />
							Total Amount
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg font-bold">
							{formatCurrency(invoice.totalAmount)}
						</p>
						<p className="text-xs text-muted-foreground">
							{invoice.items.length} item
							{invoice.items.length !== 1 ? "s" : ""}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<CreditCard className="h-4 w-4" />
							Pending Balance
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg font-bold text-orange-600">
							{formatCurrency(invoice.pendingBalance)}
						</p>
						<p className="text-xs text-muted-foreground">
							{invoice.amountPaid > 0
								? `${formatCurrency(invoice.amountPaid)} paid`
								: "No payments yet"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Mobile Tabs */}
			{isMobile ? (
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="details">Details</TabsTrigger>
						<TabsTrigger value="items">Items</TabsTrigger>
						<TabsTrigger value="payments">Payments</TabsTrigger>
					</TabsList>

					<TabsContent value="details" className="space-y-4 mt-4">
						{/* Client Info Card */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<Building2 className="h-4 w-4" />
									Client Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div>
									<p className="font-medium">
										{invoice.clientName}
									</p>
									{invoice.clientEmail && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
											<MailIcon className="h-3 w-3" />
											<span>{invoice.clientEmail}</span>
										</div>
									)}
									{invoice.clientPhone && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
											<Phone className="h-3 w-3" />
											<span>{invoice.clientPhone}</span>
										</div>
									)}
								</div>

								{invoice.projectName && (
									<div
										className="pt-2 border-t cursor-pointer hover:bg-muted/50 -mx-3 px-3 py-2 rounded"
										onClick={() =>
											navigate(
												`/projects/${invoice.projectId}`
											)
										}
									>
										<p className="text-xs text-muted-foreground">
											Project
										</p>
										<p className="text-sm font-medium text-blue-600 hover:underline">
											{invoice.projectName}
										</p>
									</div>
								)}

								{invoice.clientId && (
									<div
										className="pt-2 border-t cursor-pointer hover:bg-muted/50 -mx-3 px-3 py-2 rounded"
										onClick={() =>
											navigate(
												`/clients/${invoice.clientId}`
											)
										}
									>
										<p className="text-xs text-muted-foreground">
											View Client
										</p>
										<p className="text-sm font-medium text-blue-600 hover:underline">
											Client Details
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Totals Card */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">
									Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Subtotal:
									</span>
									<span>
										{formatCurrency(invoice.subtotal)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Tax ({invoice.taxRate}%):
									</span>
									<span>
										{formatCurrency(invoice.taxAmount)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Discount:
									</span>
									<span>
										-
										{formatCurrency(invoice.discountAmount)}
									</span>
								</div>
								<Separator />
								<div className="flex justify-between text-base font-bold">
									<span>Total:</span>
									<span>
										{formatCurrency(invoice.totalAmount)}
									</span>
								</div>
								<Separator />
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Paid:
									</span>
									<span className="text-green-600">
										{formatCurrency(invoice.amountPaid)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Pending:
									</span>
									<span className="text-orange-600 font-bold">
										{formatCurrency(invoice.pendingBalance)}
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Notes Card */}
						{(invoice.notes || invoice.termsAndConditions) && (
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium">
										Additional Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{invoice.notes && (
										<div>
											<p className="text-xs text-muted-foreground mb-1">
												Notes
											</p>
											<p className="text-sm whitespace-pre-wrap">
												{invoice.notes}
											</p>
										</div>
									)}
									{invoice.termsAndConditions && (
										<div>
											<p className="text-xs text-muted-foreground mb-1">
												Terms & Conditions
											</p>
											<p className="text-sm whitespace-pre-wrap">
												{invoice.termsAndConditions}
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						)}
					</TabsContent>

					<TabsContent value="items" className="mt-4">
						<Card>
							<CardHeader>
								<CardTitle className="text-sm font-medium">
									Invoice Items
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{invoice.items.map(
										(item: InvoiceItem, index: number) => (
											<div
												key={item.id || index}
												className="border-b last:border-0 pb-4 last:pb-0"
											>
												<p className="font-medium">
													{item.description}
												</p>
												<div className="grid grid-cols-4 gap-2 text-xs mt-2">
													<div>
														<p className="text-muted-foreground">
															Qty
														</p>
														<p className="font-medium">
															{item.quantity}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground">
															Price
														</p>
														<p className="font-medium">
															{formatCurrency(
																item.unitPrice
															)}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground">
															Disc
														</p>
														<p className="font-medium">
															{item.discountPercentage
																? `${item.discountPercentage}%`
																: "-"}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground">
															Total
														</p>
														<p className="font-medium">
															{formatCurrency(
																item.amount
															)}
														</p>
													</div>
												</div>
											</div>
										)
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="payments" className="mt-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<History className="h-4 w-4" />
									Payment History
								</CardTitle>
								{canAddPayment && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => setShowPaymentForm(true)}
									>
										<PlusCircle className="h-3 w-3 mr-1" />
										Add
									</Button>
								)}
							</CardHeader>
							<CardContent>
								{!invoice.payments ||
								invoice.payments.length === 0 ? (
									<div className="text-center py-8">
										<CreditCard className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
										<p className="text-sm text-muted-foreground">
											No payments recorded yet
										</p>
									</div>
								) : (
									<div className="space-y-3">
										{invoice.payments.map(
											(payment: any) => (
												<div
													key={payment.id}
													className="border rounded-lg p-3"
												>
													<div className="flex justify-between items-start mb-2">
														<div>
															<p className="font-medium text-sm">
																{formatDate(
																	payment.paymentDate,
																	"MMM d, yyyy"
																)}
															</p>
															<p className="text-xs text-muted-foreground">
																{
																	payment.paymentMethod
																}
															</p>
														</div>
														<Badge
															variant="outline"
															className="bg-green-50"
														>
															{formatCurrency(
																payment.amount
															)}
														</Badge>
													</div>
													{payment.referenceNumber && (
														<p className="text-xs text-muted-foreground mt-1">
															Ref:{" "}
															{
																payment.referenceNumber
															}
														</p>
													)}
												</div>
											)
										)}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			) : (
				/* Desktop View */
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Left Column - Client Info & Details */}
					<div className="space-y-6 lg:col-span-1">
						{/* Client Information */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Building2 className="h-5 w-5" />
									Client Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="font-medium text-lg">
										{invoice.clientName}
									</p>
									{invoice.clientEmail && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
											<MailIcon className="h-4 w-4" />
											<a
												href={`mailto:${invoice.clientEmail}`}
												className="hover:underline"
											>
												{invoice.clientEmail}
											</a>
										</div>
									)}
									{invoice.clientPhone && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
											<Phone className="h-4 w-4" />
											<a
												href={`tel:${invoice.clientPhone}`}
												className="hover:underline"
											>
												{invoice.clientPhone}
											</a>
										</div>
									)}
								</div>

								{invoice.projectName && (
									<div className="pt-4 border-t">
										<p className="text-sm text-muted-foreground mb-1">
											Project
										</p>
										<Button
											variant="link"
											className="p-0 h-auto text-blue-600 hover:underline"
											onClick={() =>
												navigate(
													`/projects/${invoice.projectId}`
												)
											}
										>
											{invoice.projectName}
										</Button>
									</div>
								)}

								{invoice.clientId && (
									<div className="pt-2">
										<Button
											variant="outline"
											size="sm"
											className="w-full"
											onClick={() =>
												navigate(
													`/clients/${invoice.clientId}`
												)
											}
										>
											View Client Profile
										</Button>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Invoice Details */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Receipt className="h-5 w-5" />
									Invoice Details
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											Invoice Number
										</p>
										<p className="font-medium">
											{invoice.invoiceNumber}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Status
										</p>
										<Badge
											className={getStatusColor(
												invoice.status
											)}
										>
											{invoice.status.replace("_", " ")}
										</Badge>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Issue Date
										</p>
										<p className="font-medium">
											{formatDate(
												invoice.issueDate,
												"PPP"
											)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Due Date
										</p>
										<p
											className={`font-medium ${invoice.isOverdue ? "text-red-600" : ""}`}
										>
											{formatDate(invoice.dueDate, "PPP")}
										</p>
									</div>
									{invoice.paidDate && (
										<div className="col-span-2">
											<p className="text-sm text-muted-foreground">
												Paid Date
											</p>
											<p className="font-medium text-green-600">
												{formatDate(
													invoice.paidDate,
													"PPP"
												)}
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Notes & Terms */}
						{(invoice.notes || invoice.termsAndConditions) && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Additional Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{invoice.notes && (
										<div>
											<p className="text-sm font-medium mb-1">
												Notes
											</p>
											<p className="text-sm text-muted-foreground whitespace-pre-wrap">
												{invoice.notes}
											</p>
										</div>
									)}
									{invoice.termsAndConditions && (
										<div>
											<p className="text-sm font-medium mb-1">
												Terms & Conditions
											</p>
											<p className="text-sm text-muted-foreground whitespace-pre-wrap">
												{invoice.termsAndConditions}
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						)}
					</div>

					{/* Right Column - Items & Payments */}
					<div className="space-y-6 lg:col-span-2">
						{/* Invoice Items */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">
									Invoice Items
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Description</TableHead>
											<TableHead>Type</TableHead>
											<TableHead className="text-right">
												Qty
											</TableHead>
											<TableHead className="text-right">
												Unit Price
											</TableHead>
											<TableHead className="text-right">
												Discount
											</TableHead>
											<TableHead className="text-right">
												Amount
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{invoice.items.map(
											(
												item: InvoiceItem,
												index: number
											) => (
												<TableRow
													key={item.id || index}
												>
													<TableCell>
														<div>
															<p className="font-medium">
																{
																	item.description
																}
															</p>
															{item.notes && (
																<p className="text-xs text-muted-foreground">
																	{item.notes}
																</p>
															)}
														</div>
													</TableCell>
													<TableCell>
														{item.itemType}
													</TableCell>
													<TableCell className="text-right">
														{item.quantity}
													</TableCell>
													<TableCell className="text-right">
														{formatCurrency(
															item.unitPrice
														)}
													</TableCell>
													<TableCell className="text-right">
														{item.discountPercentage
															? `${item.discountPercentage}%`
															: "-"}
													</TableCell>
													<TableCell className="text-right font-medium">
														{formatCurrency(
															item.amount
														)}
													</TableCell>
												</TableRow>
											)
										)}
									</TableBody>
								</Table>

								{/* Totals */}
								<div className="mt-6 border-t pt-4">
									<div className="flex justify-end">
										<div className="w-72 space-y-2">
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">
													Subtotal:
												</span>
												<span className="font-medium">
													{formatCurrency(
														invoice.subtotal
													)}
												</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">
													Tax ({invoice.taxRate}%):
												</span>
												<span className="font-medium">
													{formatCurrency(
														invoice.taxAmount
													)}
												</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">
													Discount:
												</span>
												<span className="font-medium">
													-
													{formatCurrency(
														invoice.discountAmount
													)}
												</span>
											</div>
											<Separator />
											<div className="flex justify-between text-lg font-bold">
												<span>Total:</span>
												<span>
													{formatCurrency(
														invoice.totalAmount
													)}
												</span>
											</div>
											<Separator />
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">
													Amount Paid:
												</span>
												<span className="font-medium text-green-600">
													{formatCurrency(
														invoice.amountPaid
													)}
												</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">
													Pending Balance:
												</span>
												<span className="font-bold text-orange-600">
													{formatCurrency(
														invoice.pendingBalance
													)}
												</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Payment History */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="text-lg flex items-center gap-2">
									<History className="h-5 w-5" />
									Payment History
								</CardTitle>
								{canAddPayment && (
									<Button
										size="sm"
										onClick={() => setShowPaymentForm(true)}
									>
										<PlusCircle className="mr-2 h-4 w-4" />
										Record Payment
									</Button>
								)}
							</CardHeader>
							<CardContent>
								{!invoice.payments ||
								invoice.payments.length === 0 ? (
									<div className="text-center py-8">
										<CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
										<p className="text-muted-foreground">
											No payments recorded yet
										</p>
									</div>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Date</TableHead>
												<TableHead>Method</TableHead>
												<TableHead>Reference</TableHead>
												<TableHead className="text-right">
													Amount
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{invoice.payments.map(
												(payment: Payment) => (
													<TableRow key={payment.id}>
														<TableCell>
															{formatDate(
																payment.paymentDate,
																"MMM d, yyyy"
															)}
														</TableCell>
														<TableCell>
															<Badge variant="outline">
																{payment.paymentMethod.replace(
																	"_",
																	" "
																)}
															</Badge>
														</TableCell>
														<TableCell>
															{payment.referenceNumber ||
																"-"}
														</TableCell>
														<TableCell className="text-right font-medium">
															{formatCurrency(
																payment.amount
															)}
														</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			)}

			{/* Edit Dialog */}
			<ScrollableDialog
				open={showEditDialog}
				onOpenChange={setShowEditDialog}
				title="Edit Invoice"
				description={`Make changes to invoice ${invoice.invoiceNumber}`}
				className="sm:max-w-[900px]"
			>
				<InvoiceForm
					initialData={{
						...invoice,
						issueDate: invoice.issueDate.split("T")[0],
						dueDate: invoice.dueDate.split("T")[0],
					}}
					onSubmit={handleUpdate}
					onCancel={() => setShowEditDialog(false)}
					clientId={invoice.clientId}
				/>
			</ScrollableDialog>

			{/* Delete Confirmation */}
			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Invoice</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete invoice{" "}
							{invoice.invoiceNumber}? This action cannot be
							undone.
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

			{/* Payment Form Dialog */}
			<ScrollableDialog
				open={showPaymentForm}
				onOpenChange={setShowPaymentForm}
				title="Record Payment"
				description={`Enter the payment details for invoice ${invoice.invoiceNumber}`}
				className="sm:max-w-[500px]"
			>
				<PaymentForm
					invoice={invoice}
					onSubmit={handleAddPayment}
					onCancel={() => setShowPaymentForm(false)}
				/>
			</ScrollableDialog>
		</div>
	);
};
