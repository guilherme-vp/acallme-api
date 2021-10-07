export interface WelcomeMailVars {
	name: string
}

export const generateWelcomeMail = ({ name }: WelcomeMailVars) => `
	<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
		<head>
		<!--[if gte mso 9]>
		<xml>
			<o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta name="x-apple-disable-message-reformatting">
			<!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
			<title></title>
			
				<style type="text/css">
					table, td { color: #000000; } a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_button_4 .v-padding { padding: 20px 50px !important; } #u_content_image_3 .v-src-width { width: auto !important; } #u_content_image_3 .v-src-max-width { max-width: 37% !important; } #u_content_text_8 .v-text-align { text-align: center !important; } #u_content_image_2 .v-src-width { width: auto !important; } #u_content_image_2 .v-src-max-width { max-width: 30% !important; } #u_content_text_6 .v-text-align { text-align: center !important; } #u_content_button_3 .v-padding { padding: 20px 50px !important; } }
		@media only screen and (min-width: 620px) {
			.u-row {
				width: 600px !important;
			}
			.u-row .u-col {
				vertical-align: top;
			}

			.u-row .u-col-48p67 {
				width: 292.02px !important;
			}

			.u-row .u-col-51p33 {
				width: 307.98px !important;
			}

			.u-row .u-col-100 {
				width: 600px !important;
			}

		}

		@media (max-width: 620px) {
			.u-row-container {
				max-width: 100% !important;
				padding-left: 0px !important;
				padding-right: 0px !important;
			}
			.u-row .u-col {
				min-width: 320px !important;
				max-width: 100% !important;
				display: block !important;
			}
			.u-row {
				width: calc(100% - 40px) !important;
			}
			.u-col {
				width: 100% !important;
			}
			.u-col > div {
				margin: 0 auto;
			}
		}
		body {
			margin: 0;
			padding: 0;
		}

		table,
		tr,
		td {
			vertical-align: top;
			border-collapse: collapse;
		}

		p {
			margin: 0;
		}

		.ie-container table,
		.mso-container table {
			table-layout: fixed;
		}

		* {
			line-height: inherit;
		}

		a[x-apple-data-detectors='true'] {
			color: inherit !important;
			text-decoration: none !important;
		}

		</style>
			
			

		<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

		</head>

		<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #efefef;color: #000000">
			<!--[if IE]><div class="ie-container"><![endif]-->
			<!--[if mso]><div class="mso-container"><![endif]-->
			<table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #efefef;width:100%" cellpadding="0" cellspacing="0">
			<tbody>
			<tr style="vertical-align: top">
				<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
				<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #efefef;"><![endif]-->
				

		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="background-color: #ffffff;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
			
		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;" align="left">
						
			<div class="v-text-align" style="line-height: 140%; text-align: left; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 36px; line-height: 50.4px; color: #000000;"><strong>ACall Me</strong></span></p>
			</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Open Sans',sans-serif;" align="left">
						
			<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
				<tbody>
					<tr style="vertical-align: top">
						<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
							<span>&#160;</span>
						</td>
					</tr>
				</tbody>
			</table>

					</td>
				</tr>
			</tbody>
		</table>

		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:0px 25px 10px;font-family:'Open Sans',sans-serif;" align="left">
						
			<div class="v-text-align" style="color: #333333; line-height: 160%; text-align: center; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 160%;"><span style="font-size: 30px; line-height: 48px;"><strong><span style="line-height: 48px; font-family: Lato, sans-serif; font-size: 30px;">SEJA BEM-VINDO(A) ${name}!</span></strong></span></p>
			</div>

					</td>
				</tr>
			</tbody>
		</table>

		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px 30px;font-family:'Open Sans',sans-serif;" align="left">
						
			<div class="v-text-align" style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 140%;"><span style="font-size: 20px; line-height: 28px;">N&oacute;s agradecemos imensamente pela sua presen&ccedil;a em nosso servi&ccedil;o, saiba que estamos fazendo o melhor para que sua experi&ecirc;ncia seja inesquec&iacute;vel</span></p>
			</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table id="u_content_button_4" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;" align="left">
						
		<div class="v-text-align" align="center">
			<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Open Sans',sans-serif;"><tr><td class="v-text-align" style="font-family:'Open Sans',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:56px; v-text-anchor:middle; width:234px;" arcsize="62.5%" stroke="f" fillcolor="#e67e23"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Open Sans',sans-serif;"><![endif]-->
				<a href="" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:'Open Sans',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #e67e23; border-radius: 35px;-webkit-border-radius: 35px; -moz-border-radius: 35px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
					<span class="v-padding" style="display:block;padding:20px 40px;line-height:120%;"><span style="font-size: 14px; line-height: 16.8px;"><strong><span style="line-height: 16.8px; font-size: 14px;">INICIAR TRATAMENTO</span></strong></span></span>
				</a>
			<!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
		</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:'Open Sans',sans-serif;" align="left">
						
			<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
				<tbody>
					<tr style="vertical-align: top">
						<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
							<span>&#160;</span>
						</td>
					</tr>
				</tbody>
			</table>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 35px;font-family:'Open Sans',sans-serif;" align="left">
						
			<div class="v-text-align" style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 140%;"><span style="font-size: 28px; line-height: 39.2px;"><strong><span style="line-height: 39.2px; font-size: 28px;">Cuide da sua mente</span></strong></span></p>
			</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="292" style="width: 292px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-48p67" style="max-width: 320px;min-width: 292px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table id="u_content_image_3" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;" align="left">
						
		<table width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
					
					<img align="center" border="0" src="cid:heart" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 136px;" width="136" class="v-src-width v-src-max-width"/>
					
				</td>
			</tr>
		</table>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
		<!--[if (mso)|(IE)]><td align="center" width="308" style="width: 308px;padding: 15px 0px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-51p33" style="max-width: 320px;min-width: 308px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 15px 0px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table id="u_content_text_8" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 10px 10px;font-family:'Open Sans',sans-serif;" align="left">
						
			<div class="v-text-align" style="line-height: 150%; text-align: left; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 150%;">"N&oacute;s e nossos profissionais estaremos prontos para te atender e dar todo o suporte necess&aacute;rio para voc&ecirc; realizar seu atendimento"</p>
			</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:'Open Sans',sans-serif;" align="left">
						
			<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
				<tbody>
					<tr style="vertical-align: top">
						<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
							<span>&#160;</span>
						</td>
					</tr>
				</tbody>
			</table>

					</td>
				</tr>
			</tbody>
		</table>

		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 35px;font-family:'Open Sans',sans-serif;" align="left">
						
			<div class="v-text-align" style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 140%;"><span style="font-size: 28px; line-height: 39.2px;"><strong><span style="line-height: 39.2px; font-size: 28px;">A qualquer hora e qualquer lugar</span></strong></span></p>
			</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="292" style="width: 292px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-48p67" style="max-width: 320px;min-width: 292px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table id="u_content_image_2" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;" align="left">
						
		<table width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
					
					<img align="center" border="0" src="cid:clock" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 136px;" width="136" class="v-src-width v-src-max-width"/>
					
				</td>
			</tr>
		</table>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
		<!--[if (mso)|(IE)]><td align="center" width="308" style="width: 308px;padding: 15px 0px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-51p33" style="max-width: 320px;min-width: 308px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 15px 0px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table id="u_content_text_6" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 10px 10px;font-family:'Open Sans',sans-serif;" align="left">
						
			<div class="v-text-align" style="line-height: 150%; text-align: left; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 150%;">"Encontre o especialista e o tratamento ideais em poucos cliques. Comece agora a se tratar via Teleconsulta, a dist&acirc;ncia&nbsp; e o tempo n&atilde;o s&atilde;o mais um problema."</p>
			</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Open Sans',sans-serif;" align="left">
						
			<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
				<tbody>
					<tr style="vertical-align: top">
						<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
							<span>&#160;</span>
						</td>
					</tr>
				</tbody>
			</table>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table id="u_content_button_3" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;" align="left">
						
		<div class="v-text-align" align="center">
			<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Open Sans',sans-serif;"><tr><td class="v-text-align" style="font-family:'Open Sans',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:49px; v-text-anchor:middle; width:206px;" arcsize="71.5%" stroke="f" fillcolor="#e67e23"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Open Sans',sans-serif;"><![endif]-->
				<a href="" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:'Open Sans',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #e67e23; border-radius: 35px;-webkit-border-radius: 35px; -moz-border-radius: 35px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
					<span class="v-padding" style="display:block;padding:15px 35px;line-height:120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong><span style="line-height: 19.2px; font-size: 16px;">VEJA MAIS SOBRE</span></strong></span></span>
				</a>
			<!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
		</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>



		<div class="u-row-container" style="padding: 0px;background-color: transparent">
			<div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					
		<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
		<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
			<div style="width: 100% !important;">
			<!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
			
		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px;font-family:'Open Sans',sans-serif;" align="left">
						
			<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="72%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #413d45;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
				<tbody>
					<tr style="vertical-align: top">
						<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
							<span>&#160;</span>
						</td>
					</tr>
				</tbody>
			</table>

					</td>
				</tr>
			</tbody>
		</table>

		<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
			<tbody>
				<tr>
					<td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;" align="left">
						
			<div class="v-text-align" style="color: #7e7e81; line-height: 150%; text-align: center; word-wrap: break-word;">
				<p style="font-size: 14px; line-height: 150%;"><span style="font-size: 12px; line-height: 18px;">1106 Av. Paulista - 7&ordm; andar | Cerqueira C&eacute;sar&nbsp; SP | Brasil</span></p>
		<p style="font-size: 14px; line-height: 150%;"><span style="font-size: 12px; line-height: 18px;">&copy; ACall Me</span></p>
			</div>

					</td>
				</tr>
			</tbody>
		</table>

			<!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
			</div>
		</div>
		<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				</div>
			</div>
		</div>


				<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
				</td>
			</tr>
			</tbody>
			</table>
			<!--[if mso]></div><![endif]-->
			<!--[if IE]></div><![endif]-->
		</body>

		</html>
`
