using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyApp.Persistence;
using Microsoft.EntityFrameworkCore;
using MyApp.Core.Models;
using Microsoft.AspNetCore.Identity;
using AspNet.Security.OpenIdConnect.Primitives;

namespace MyApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            services.AddDbContext<ApplicationDbContext>(o =>
            {
                o.UseSqlServer(Configuration.GetConnectionString("Default"));   
                 o.UseOpenIddict();           
            });

            services.AddIdentity<ApplicationUser, IdentityRole>(
                options => {
                    options.Password.RequiredLength = 4;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase =false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequiredUniqueChars = 0;
                }
            )
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
                       {
                           options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                           options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                           options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
                       });

                  // Register the OpenIddict services.
            // Note: use the generic overload if you need
            // to replace the default OpenIddict entities.
            services.AddOpenIddict()           
            // Register the OpenIddict core services.
            .AddCore(options =>
            {
              //options.
                // Register the Entity Framework stores and models.
                options.UseEntityFrameworkCore()
                        .UseDbContext<ApplicationDbContext>();
                        
            })
            .AddServer
            (options =>
            {
                
                options.UseMvc();

                // Enable the token endpoint (required to use the password flow).
                options.EnableTokenEndpoint("/connect/token");

                // Allow client applications to use the grant_type=password flow.
                options.AllowPasswordFlow()
                .AllowRefreshTokenFlow();
                
                // Accept token requests that don't specify a client_id.
                options.AcceptAnonymousClients();

                // During development, you can disable the HTTPS requirement.
                options.DisableHttpsRequirement();

                options.RegisterScopes(
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.Email
                );

                // Note: to use JWT access tokens instead of the default
                // encrypted format, the following lines are required:
                //
                // options.UseJsonWebTokens();
                // options.AddEphemeralSigningKey();

            });

            services.AddAuthentication()
            .AddOAuthValidation();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                  HotModuleReplacement = true,
                  ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                    routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
