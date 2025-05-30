USE [TravelApp]
GO
/****** Object:  Table [dbo].[Bis]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bis](
	[BisID] [int] IDENTITY(1,1) NOT NULL,
	[NamaBis] [varchar](100) NULL,
	[Kapasitas] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[BisID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Dataset]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dataset](
	[Nomor] [smallint] NOT NULL,
	[Nama_Pemesan] [nvarchar](50) NOT NULL,
	[Tanggal_Pesanan] [date] NOT NULL,
	[Tanggal_Keberangkatan] [date] NOT NULL,
	[Jumlah_Peserta] [smallint] NOT NULL,
	[Tujuan] [nvarchar](50) NOT NULL,
	[Lama] [nvarchar](50) NOT NULL,
	[Bis] [nvarchar](50) NOT NULL,
	[Penginapan] [nvarchar](50) NULL,
	[Makan] [nvarchar](50) NOT NULL,
	[Snack] [nvarchar](50) NOT NULL,
	[Patwal] [nvarchar](50) NOT NULL,
	[Detail_Wisata] [nvarchar](100) NOT NULL,
	[Paket] [nvarchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Dataset2]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dataset2](
	[Nomor] [tinyint] NOT NULL,
	[Nama_Pemesan] [nvarchar](50) NOT NULL,
	[Tanggal_Pesanan] [date] NOT NULL,
	[Tanggal_Keberangkatan] [date] NOT NULL,
	[Jumlah_Peserta] [smallint] NOT NULL,
	[Tujuan] [nvarchar](50) NOT NULL,
	[Lama] [nvarchar](50) NOT NULL,
	[Bis] [nvarchar](50) NOT NULL,
	[Penginapan] [nvarchar](50) NULL,
	[Makan] [nvarchar](50) NOT NULL,
	[Snack] [nvarchar](50) NOT NULL,
	[Patwal] [nvarchar](50) NOT NULL,
	[Detail_Wisata] [nvarchar](100) NOT NULL,
	[Paket] [nvarchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ImageUrls]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ImageUrls](
	[Id_Image] [int] IDENTITY(1,1) NOT NULL,
	[Url_1] [varchar](255) NULL,
	[Url_2] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Paket]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Paket](
	[PaketID] [int] IDENTITY(1,1) NOT NULL,
	[NamaPaket] [varchar](100) NULL,
	[LamaHari] [varchar](10) NULL,
	[IncludeMakan] [varchar](10) NULL,
	[IncludeSnack] [varchar](10) NULL,
	[IncludePatwal] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[PaketID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pemesan]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pemesan](
	[PemesanID] [int] IDENTITY(1,1) NOT NULL,
	[NamaPemesan] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[PemesanID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Penginapan]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Penginapan](
	[PenginapanID] [int] IDENTITY(1,1) NOT NULL,
	[NamaPenginapan] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[PenginapanID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pesanan]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pesanan](
	[PesananID] [int] IDENTITY(1,1) NOT NULL,
	[PemesanID] [int] NULL,
	[PaketID] [int] NULL,
	[TanggalPesanan] [date] NULL,
	[TanggalKeberangkatan] [date] NULL,
	[JumlahPeserta] [int] NULL,
	[BisID] [int] NULL,
	[PenginapanID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[PesananID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pesanan_DetailWisata]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pesanan_DetailWisata](
	[PesananID] [int] NOT NULL,
	[TujuanID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[PesananID] ASC,
	[TujuanID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TujuanWisata]    Script Date: 21/05/2025 17:50:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TujuanWisata](
	[TujuanID] [int] IDENTITY(1,1) NOT NULL,
	[NamaTempat] [varchar](100) NULL,
	[Kota] [varchar](100) NULL,
	[Keterangan] [text] NULL,
	[type] [varchar](10) NULL,
	[ImgUrl] [varchar](50) NULL,
	[Popularity] [int] NULL,
	[ImageID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[TujuanID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Pesanan]  WITH CHECK ADD FOREIGN KEY([BisID])
REFERENCES [dbo].[Bis] ([BisID])
GO
ALTER TABLE [dbo].[Pesanan]  WITH CHECK ADD FOREIGN KEY([PaketID])
REFERENCES [dbo].[Paket] ([PaketID])
GO
ALTER TABLE [dbo].[Pesanan]  WITH CHECK ADD FOREIGN KEY([PemesanID])
REFERENCES [dbo].[Pemesan] ([PemesanID])
GO
ALTER TABLE [dbo].[Pesanan]  WITH CHECK ADD FOREIGN KEY([PenginapanID])
REFERENCES [dbo].[Penginapan] ([PenginapanID])
GO
ALTER TABLE [dbo].[Pesanan_DetailWisata]  WITH CHECK ADD FOREIGN KEY([PesananID])
REFERENCES [dbo].[Pesanan] ([PesananID])
GO
ALTER TABLE [dbo].[Pesanan_DetailWisata]  WITH CHECK ADD FOREIGN KEY([TujuanID])
REFERENCES [dbo].[TujuanWisata] ([TujuanID])
GO
