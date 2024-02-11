# Host Static Webpage
1. **Route 53** -> Domains -> Registered Domains -> Register Domains (my_domain.com)
2. **Certificate Manager** -> Request a Certificate (must be in area US-East-1!)
   1. Public
   2. Write the domain name you registered
      1. `my_domain.com`
      2. `*.my_domain.com` (covers subdomains)
   3. DNS validation
      1. For validation, either click the automated insertion or go to **Route 53**
3. **Route 53** -> Hosted Zones -> select the domain's hosted zone
   1. NS & SOA are automatically created when registering a domain
      1. Check if the NS (name-server) record has the same name-servers with the ones form any WHOIS check (https://who.is/whois/). If not, update the name-servers in the NS record to match the ones in the domain.
   2. (if there is no CNAME record created automatically by the certificate authority) *Create Record* -> CNAME -> name/value copied from the certificate above
4. **S3** -> Create Bucket
   1. Choose name (must be the same as the domain, without 'www') & region, leave the rest as-is.
   2. Upload files (index.html, styles.css, background.jpg, ...) in the bucket.
5. **CloudFront** -> *Create Distribution*
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
6. **S3** -> domain bucket -> Permissions -> update the policy with the details provided by CloudFront
7. **Route 53** -> Hosted Zones -> Domain's Hosted Zone -> *Create Record* (do this for the domain (`my_domain.com`) and all required subdomains (`www.my_domain.com`))
   1. Hit *switch to wizard*
   2. Select *simple routing*
   3. Hit *define simple record*
      1. Record type: A
      2. Value/Route traffic to: Alias to CloudFront distribution
      3. Region: same as the distribution/bucket
      4. Url: the distribution should appear in the list
      5. Evaluate target health: No
8. **Route 53** -> Hosted Zones -> Domain's Hosted Zone -> *Create Record* (do this for all required subdomains (`www.my_domain.com`)
   1. Hit *switch to wizard*
   2. Select *simple routing*
   3. Hit *define simple record*
      1. Record type: CNAME
      2. Value/Route traffic to: "main domain"

# Work Mail

- AWS WorkMail can be used to host email services for custom domains.
1. **Route 53** -> Domains -> Registered Domains -> Register Domains (my_domain.com)
2. **WorkMail**
   1. *Create Organisation* -> Existing Route53 domain
      1. Route53 hosted zone: domain's hosted zone
      2. Alias: any alias
   2. Organisations -> select the organisation
      2. Domains
         1. select the domain -> *Set As Default*
         2. enter the domain details
            1. Updated all in Route53 (to automatically add appropriate DNS entries)
            2. Improved email delivery -> configure at SES -> Custom MAIL FROM domain -> Edit
      3. Users -> *Add User* -> populate fields as needed

<!-- https://docs.aws.amazon.com/workmail/latest/userguide/using_IMAP.html -->
<!-- https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html -->
<!-- https://docs.aws.amazon.com/workmail/latest/userguide/outlook-client.html#connect-outlook-client -->
<!-- https://docs.aws.amazon.com/workmail/latest/adminguide/autodiscover.html -->