# Use nginx to serve the static files
FROM nginx:alpine
 
# Copy the build folder to the nginx default html location
COPY ./build /usr/share/nginx/html
 
# Expose port 80
EXPOSE 80
 
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
 
 
 
