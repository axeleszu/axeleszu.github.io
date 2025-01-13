<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">

        <head>
            <title>
                <xsl:value-of select="/rss/channel/title" /> RSS Feed</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <style type="text/css">
            body {
                font-family: Helvetica, Arial, sans-serif;
                font-size: 14px;
                color: #545454;
                background: #DDD;
                line-height: 1.5;
            }

            .ultima_fecha {
                font-size: smaller;
                text-align: right;
            }

            a,
            a:link,
            a:visited {
                color: #4479A2;
                text-decoration: none;
            }

            a:hover {
                color: #000;
                text-decoration: underline;
            }

            h1,
            h2,
            h3,
            p {
                margin-top: 0;
                margin-bottom: 20px;
            }

            h2 {
                font-size: 1.6em!important;
                font-weight: bold;
                color: #4479A2;
            }

            h3 {
                font-style: italic;
            }

            #content {
                width: 750px;
                margin: 0 auto;
                background: #FFF;
                padding: 2em;
            }

            #channel-image {
                float: right;
                width: 200px;
                margin-bottom: 20px;
            }

            #channel-image img {
                width: 200px;
                height: auto;
                border-radius: 5px;
            }

            #channel-header {
                margin-bottom: 20px;
            }

            #channel-header h1 {
                color: #003170;
            }

            .channel-item {
                clear: both;
                border-top: 1px solid #E5E5E5;
                padding-top: 1em;
            }

            .channel-item img {
                width: 100px;
                height: auto;
                margin: 0 30px 15px 0;
                float:left;
            }

            .episode_meta {
                font-size: 11px;
                font-weight: bold;
                font-style: italic;
            }
            </style>
        </head>

        <body>
            <div id="content">
                <div id="channel-header">
                    <p class="ultima_fecha"> Última fecha de actualización:
                        <xsl:value-of select="/rss/channel/lastBuildDate" />
                    </p>
                    <h1>
                            <xsl:if test="/rss/channel/image">
                                <div id="channel-image">
                                    <a>
                                        <xsl:attribute name="href">
                                            <xsl:value-of select="/rss/channel/image/link"/>
                                        </xsl:attribute>
                                        <img>
                                            <xsl:attribute name="src">
                                                <xsl:value-of select="/rss/channel/image/url"/>
                                            </xsl:attribute>
                                            <xsl:attribute name="title">
                                                <xsl:value-of select="/rss/channel/image/title"/>
                                            </xsl:attribute>
                                        </img>
                                    </a>
                                </div>
                            </xsl:if>
                            <xsl:value-of select="/rss/channel/title"/>
                        </h1>
                    <p>
                        <xsl:value-of select="/rss/channel/description" />
                    </p>
                    <p>
                        <a>
                            <xsl:attribute name="href">
                                <xsl:value-of select="/rss/channel/link" />
                            </xsl:attribute>
                            <xsl:attribute name="target">_blank</xsl:attribute>
                            Visitar sitio del podcast &#x0226B;
                        </a>
                    </p>
                </div>
                <xsl:for-each select="/rss/channel/item">
                    <div class="channel-item">
                        <h2>
                            <xsl:value-of select="title"/>
                        </h2>
                        <img>
                          <xsl:attribute name="src">
                              <xsl:value-of select="itunes:image/@href"/>
                          </xsl:attribute>
                        </img>
                        <xsl:if test="description">
                            <p>
                                <xsl:value-of select="description" disable-output-escaping="yes" />
                            </p>
                        </xsl:if>
                        <p class="episode_meta">
                            <a>
                                <xsl:attribute name="href">
                                    <xsl:value-of select="enclosure/@url" />
                                </xsl:attribute>
                                <xsl:attribute name="download"></xsl:attribute>
                                Descargar
                            </a> |
                            <a>
                                <xsl:attribute name="href">
                                    <xsl:value-of select="enclosure/@url" />
                                </xsl:attribute>
                                <xsl:attribute name="target">_blank</xsl:attribute>
                                Abrir en una nueva ventana
                            </a> | Tamaño:
                            <xsl:value-of select='format-number(number(enclosure/@length div "1024000"),"0.0")' />MB
                        </p>
                    </div>
                </xsl:for-each>
            </div>
        </body>

        </html>
    </xsl:template>
</xsl:stylesheet>
