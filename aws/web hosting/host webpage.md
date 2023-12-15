# Instructions
3. **Route 53** -> Domains -> Registered Domains -> Register Domains (my_domain.com)
4. **Certificate Manager** -> Request a Certificate (must be in area US-East-1!)
   1. Public
   2. Write the domain name you registered
      1. `my_domain.com`
      2. `*.my_domain.com` (covers subdomains)
   3. DNS validation
      1. For validation, either click the automated insertion or go to **Route 53**
5. **Route 53** -> Hosted Zones -> select the domain's hosted zone
   1. NS & SOA are automatically created when registering a domain
      1. Check if the NS (name-server) record has the same name-servers with the ones form any WHOIS check (https://who.is/whois/). If not, update the name-servers in the NS record to match the ones in the domain.
   2. (if there is no CNAME record created automatically by the certificate authority) *Create Record* -> CNAME -> name/value copied from the certificate above
   3.
1. **S3** -> Create Bucket
   1. Choose name (must be the same as the domain, without 'www') & region, leave the rest as-is.
   2. Upload files (index.html, styles.css, background.jpg, ...) in the bucket.
2. **CloudFront** -> *Create Distribution*
   1. Origin Domain: select the bucket that contains the website
   2. Origin Access: origin access control settings (buckets can restrict access to only CloudFront)
   3. *Create Control Setting*
   4. Viewer -> Viewer protocol policy: redirect HTTP to HTTPS
   5. WAF -> Do not enable
   6. Settings
      1. Alternate Domain Names: add the required domain names
      2. Custom SSL Certificate: select the certificate from above
      3. Supported HTTP versions: HTTP/2, HTTP/3 (as needed)
      4. Default root object: index.html (or whatever the entry point is)
3. **S3** -> domain bucket -> Permissions -> update the policy with the details provided by CloudFront
4. **Route 53** -> Hosted Zones -> Domain's Hosted Zone -> *Create Record* (do this for the domain (`my_domain.com`) and all required subdomains (`www.my_domain.com`))
      1. Hit *switch to wizard*
      2. Select *simple routing*
      3. Hit *define simple record*
         1. Record type: A
         2. Value/Route traffic to: Alias to S3 website endpoint
         3. Region: same as the bucket
         4. Url: the bucket should appear when you click in the box
         5. Evaluate target health: No
