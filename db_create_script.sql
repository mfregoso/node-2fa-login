USE [People]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[Email] [nvarchar](150) NOT NULL,
	[Name] [nvarchar](150) NOT NULL,
	[Password] [nvarchar](150) NULL,
	[Phone] [nvarchar](20) NOT NULL,
	[IsConfirmed] [bit] NOT NULL,
 CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoginCode]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoginCode](
	[Email] [nvarchar](150) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
	[Expiration] [datetime2](7) NULL,
 CONSTRAINT [PK_LoginCode] PRIMARY KEY CLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RegisterCode]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RegisterCode](
	[Email] [nvarchar](150) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
	[Expiration] [datetime2](7) NULL,
 CONSTRAINT [PK_RegisterCode] PRIMARY KEY CLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Account] ADD  CONSTRAINT [DF_Account_IsConfirmed]  DEFAULT ((0)) FOR [IsConfirmed]
GO
/****** Object:  StoredProcedure [dbo].[Account_Insert]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[Account_Insert]
/*
exec Account_Insert @Email='test@gmail.com', @Name='Jonny Boy', @Phone='8005552334', @Password='hidden'
*/

  @Email nvarchar(150)
, @Name nvarchar(150)
, @Password nvarchar(150)
, @Phone nvarchar(20)

as

insert into Account
	(Email, Name, Phone, Password)
values (@Email, @Name, @Phone, @Password)
GO
/****** Object:  StoredProcedure [dbo].[Account_Login]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[Account_Login]
/*
exec Account_Login @Email='fake@gmail.com', @Password='hidden', @IsConfirmed=NULL, @Phone=NULL
*/

  @Email nvarchar(150)
, @Password nvarchar(150)
, @IsConfirmed bit output
, @Phone nvarchar(20) output

as

set @IsConfirmed=NULL
set @Phone=NULL
select @IsConfirmed=IsConfirmed, @Phone=Phone
from Account
where Email=@Email AND Password=@Password
print @IsConfirmed
print @Phone
GO
/****** Object:  StoredProcedure [dbo].[Account_SetConfirmed]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[Account_SetConfirmed]
/*
exec Account_SetConfirmed @Email='test@gmail.com'
*/

@Email nvarchar(150)

as

update Account
set IsConfirmed=1
where Email=@Email
GO
/****** Object:  StoredProcedure [dbo].[LoginCode_Insert]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[LoginCode_Insert]
/*
exec LoginCode_Insert @Email='test@gmail.com', @Code='555800'
*/

  @Email nvarchar(150)
, @Code nvarchar(20)
, @Expiration datetime2 = NULL

as

delete LoginCode
where Email=@Email

insert LoginCode 
 (Email, Code, Expiration)
values
 (@Email, @Code, @Expiration)
GO
/****** Object:  StoredProcedure [dbo].[LoginCode_Verify]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[LoginCode_Verify]
/*
exec LoginCode_Verify @Email='testing@gmail.com', @Code='307186', @Verified=0
*/

  @Email nvarchar(150)
, @Code nvarchar(20)
, @Verified bit output

as

set @Verified=0
select @Verified=1
from LoginCode
where exists (
	select null
	from LoginCode
	where Email=@Email AND Code=@Code
	)
if @Verified = 1
delete LoginCode where Email=@Email
GO
/****** Object:  StoredProcedure [dbo].[RegisterCode_Insert]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[RegisterCode_Insert]
/*
exec RegisterCode_Insert @Email='test@gmail.com', @Code='555800'
*/

  @Email nvarchar(150)
, @Code nvarchar(20)
, @Expiration datetime2(7) = NULL

as

delete RegisterCode
where Email=@Email

insert RegisterCode 
 (Email, Code, Expiration)
values
 (@Email, @Code, @Expiration)
GO
/****** Object:  StoredProcedure [dbo].[RegisterCode_Verify]    Script Date: 4/25/2019 5:14:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[RegisterCode_Verify]
/*
exec RegisterCode_Verify @Email='fake@gmail.com', @Code='289508', @Verified=0
*/

  @Email nvarchar(150)
, @Code nvarchar(20)
, @Verified bit output

as

set @Verified=0
select @Verified=1
from RegisterCode
where exists (
	select null
	from RegisterCode
	where Email=@Email AND Code=@Code
	)
if @Verified = 1
delete RegisterCode where Email=@Email
GO
