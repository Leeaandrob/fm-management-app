package router

import (
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/vantech-neonetics/fm-management-app/controller"
	"github.com/vantech-neonetics/fm-management-app/middleware"
)

func SetDashboardRouter(router *gin.Engine) {
	apiRouter := router.Group("/")
	apiRouter.Use(middleware.CORS())
	apiRouter.Use(gzip.Gzip(gzip.DefaultCompression))
	apiRouter.Use(middleware.GlobalAPIRateLimit())
	apiRouter.Use(middleware.TokenAuth())
	{
		apiRouter.GET("/dashboard/billing/subscription", controller.GetSubscription)
		apiRouter.GET("/v1/dashboard/billing/subscription", controller.GetSubscription)
		apiRouter.GET("/dashboard/billing/usage", controller.GetUsage)
		apiRouter.GET("/v1/dashboard/billing/usage", controller.GetUsage)
	}
}
